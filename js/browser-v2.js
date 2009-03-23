// current option button
var active_option = null;
// drag & drop - initial position
var file_mousePos = null;
var file_dragged = null;
// folder list variables 
var current_folder = null;
var changed_folder = null;
var can_change = true;
var multiUpload = null;

// afiseaza form-ul pt. upload
function showForm (current_option) 
{
	// daca deja este afisat un form, il ascundem
	if ($defined(active_option)) {
		$(active_option + 'Form').setStyle('display', 'none');
		$(active_option + 'Button').getElement('a').className = 'none';
		if (current_option == active_option) {
			active_option = null;
			return;
		}
		active_option = null;
	}
	// cancel if no form showed
	if (! $defined(current_folder))
		return;
		
	$(current_option + 'Form').setStyle('display', 'block');
	$(current_option + 'Button').getElement('a').className = 'current';
	active_option = current_option;
}

// click pe un folder
function folderClick (folder)
{
	if(!can_change) {
		alert ("You can't change the folder while uploading!");
		return;
	}
	
	var folder_name = $(folder).getText();
	var url = 'list.php?dir=' + folder_name;
	
	var myRequest = new Request({
		'url' : url, 
		'method' : 'get',
		'onSuccess' : function(reponseText, responseXML) {
			changed_folder = folder;
			folderLoad(reponseText, responseXML);
		}
	}).send();
}

function folderLoad (reponseText, responseXML)
{
	var folder_name = $(changed_folder).getText().trim();
	// sets the action for the upload form
	$('upload_form').action = 'upload.php?dir=' + folder_name;
	// TODO: get the extension from the server
	// determine the file extensions for the upload form
	var ext = '';
	switch (folder_name) {
		case 'Images':
			ext = 'jpg';
			break; 
		case 'Movies':
			ext = 'flv';
			break;
		case 'Text':
			ext = 'txt';
			break;
	} 
	multiUpload.setFileExtensions(ext);
	// check if we need to reset the upload form
	multiUpload.checkReset();
	
	// change the icons
	if ($defined(current_folder))
		$(current_folder).getElement('a').className = 'none';
	$(changed_folder).getElement('a').className = 'current';
	current_folder = changed_folder;
	
	// TODO: do this with JSON
	$('fileList').setHTML(reponseText);
	
	var files = $('fileList').getChildren();
	files.each(function(file){
		file.addEvents({
			'mousedown': function(ev) {
				fileMousedown (file, ev);
				return false;
			},
			'click' : function(ev) {
				fileClicked(file);
				return false;
			}
		});
	});
}

function uploadStart()
{
	can_change = false;
	$('uploadMsg').setStyle('display', 'block');
	$('uploadMsg').setHTML("<img src='img/loading_04.gif'/><span>Uploading...</span>");
}

/* handle the response for the file upload */
function uploadResponse()
{
	can_change = true;
	var doc = window.frames['upload_iframe'].document;
	var msg = doc.upload_msg;
	var files = doc.upload_files;
	// write the message
	if($defined(msg)) {
		$('uploadMsg').setHTML(msg);
		$('uploadMsg').setStyle('display', 'block');
	} else {
		$('uploadMsg').setHTML('Fatal error!');
		return;
	}
	// add the files
	$each(files, function(file){
		addFile(file);
	});
}

function uploadNewSession()
{
	$('uploadMsg').setStyle('display', 'none');
	$('uploadMsg').setHTML('');
}

function fileClicked(file)
{
	detailsFill(file);
	return false;
}

/* mouse button was pressed on a file */
function fileMousedown (file, ev)
{
	file_mousePos = ev.page;

	file.addEvents({
		'mousemove' : function(ev) {
			fileDragCheck(ev, file);
			return false;
		}, 
		'mouseup' : function(){
			file.removeEvents('mousemove');
			file.removeEvent('mouseup');
			return false;
		}
	});
	file.removeEvent ('mousedown', fileMousedown);
	
	return false;
}

/* checks if we can start dragging */
function fileDragCheck (ev, file)
{
	var distance = Math.round(Math.sqrt(Math.pow(ev.page.x - file_mousePos.x, 2) 
		+ Math.pow(ev.page.y - file_mousePos.y, 2)));
	
	if (distance > 4) {
		ev = new Event(ev).stop();
		file.removeEvents('mousemove');
		// drop object
		var drop = $('trashbin');
		// calculate the position
		var coord = file.getCoordinates();
		var scroll = $('fileList').getScroll();
		if(!window.opera)
			coord.top -= scroll.y;
		// clonez elementul	 
		var file_clone = file.clone()
			.setStyles({'opacity': 0.7, 'position': 'absolute'})
			.setStyles(coord) 
			.addClass('offset')
			.addEvent('emptydrop', function() {
				this.remove();
				drop.removeEvents();
			}).inject($('fileList'));
		
		drop.addEvents({
			'drop': function() {
				drop.removeEvents();
				file_clone.remove();
				drop.removeClass ('trash-full');
				drop.addClass ('trash');
				// call the user function
				fileDragStop(file);
			},
			'over': function() {
				drop.removeClass ('trash');
				drop.addClass ('trash-full');
			},
			'leave': function() {
				drop.removeClass ('trash-full');
				drop.addClass ('trash');
			}
		});
		
		var drag = file_clone.makeDraggable({
			'droppables': [drop]
		}); 
		drag.addEvents({
			'onCancel': function() {
				file_clone.remove();
				drop.removeEvents();
			}
		});
		
		drag.start(ev);
	}

	return false;
}

/* When the file is dragged in the recycle bin */
function fileDragStop(file)
{
	var file_name = file.getElementsByTagName('div')[1].getText();
	var folder_name = $(current_folder).getText();
	var url = 'delete.php?dir=' + folder_name + '&file=' + file_name;
	
	var myRequest = new Request({
		'url' : url, 
		'method' : 'get',
		'onSuccess' : function(reponseText, responseXML) {
			// TODO: handle errors
			var result = eval(reponseText);
			file.remove();
		}
	}).send();
}

/* Adds a file */
function addFile (file)
{
	var thumb_div = new Element(
		'div', {
			'class': 'thumb normal'
		}
	);
	var thumb_img = new Element(
		'img', {
			'src': file.src,
			'alt': file.name,
			'title': file.src,
			'desc': ''
		}
	);
	var name_div = new Element(
		'div', {
			'class': 'name'
		}
	);
	var li = new Element(
		'li', {
			'class': 'file',
			'events': {
				'mousedown' : function(ev) {
					fileMousedown(li, ev);
					return false;
				},
				'click' : function(ev) {
					fileClicked(li);
				}
			}
		}
	);
	name_div.setText(file.name);
	thumb_div.adopt(thumb_img);
	li.adopt(thumb_div).adopt(name_div);
	$('fileList').adopt(li);
}

function detailsFill(file)
{
	var img = file.getElementsByTagName('img')[0];
	var name = img.getProperty('alt');
	var desc = img.getProperty('desc');
	var ext = name.substring(name.lastIndexOf('.'));
	name = name.substring(0, name.lastIndexOf('.'));
	
	$('fileName').value = name;
	$('fileNameNew').value = name;
	$('fileExt').value = ext;
	$('fileDesc').value = desc;
}

function detailsSave()
{
	var myRequest = new Request({
		'url' : 'change.php', 
		'method': 'post',
		'onSuccess' : function(reponseText, responseXML) {
			var result = eval(reponseText);
			var folder_name = $(current_folder).getText();
			// ignore the response the current folder changed
			if(folder_name != result.dir) return;
			// update the file
			var files = $('fileList').getChildren();
			files.each(function(file){
				var div_name = file.getElementsByTagName('div')[1];
				if(div_name.getText() == result.file_name) {
					var img = file.getElementsByTagName('img')[0];
					div_name.setText(result.file_name_new);
					img.setProperty('alt', result.file_name_new);
					img.setProperty('desc', result.desc);
				}
			});
		}
	});
	// contruct the data
	var data = {
		'dir': $(current_folder).getText(),
		'file_name': $('fileName').value,
		'file_name_new': $('fileNameNew').value,
		'file_ext': $('fileExt').value,
		'file_desc': $('fileDesc').value
	};
	// send the data
	myRequest.post(data);
}

function init ()
{
	$('detailsButton').addEvent ('click', function () {
		showForm ('details');
	});
	$('uploadButton').addEvent ('click', function () {
		showForm ('upload');
	});

	// atasam ev. pt. "folders"
	var folders = $('folderList').getChildren();
	folders.each(function (folder) {
		folder.addEvents ({
			'click' : function() {
				folderClick (this);
			}
		});
	});
	
	multiUpload = new MultiUpload(
		$('upload_iframe'),
		$('upload_form').getElementsByTagName('input')[0], 
		".jpg .png"
	);
	multiUpload.addEvents({
		'onStart': uploadStart,
		'onResponse': uploadResponse,
		'onNewSession': uploadNewSession
	});
}

window.addEvent('domready', init);