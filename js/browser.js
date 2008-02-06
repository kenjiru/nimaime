/**
 * TODO:
 * - replace addClass() and removeClass() with className property 
 */

// form-ul afisat
var formShowed = null;
// drag&drop - pozitia initiala
var file_mousePos = null;
var file_dragged = null;
/* folder list variables */
var current_folder = null;
var changed_folder = null;
var can_change = true;
var multiUpload = null;

// afiseaza form-ul pt. upload
function showForm (form) 
{
	// daca deja este afisat un form, il ascundem
	if ($defined (formShowed)) {
		formShowed.setStyle ('display', 'none');
		if (formShowed == form) {
			formShowed = null;
			return;
		}
		formShowed = null;
	}
	// cancel if no form showed
	if (! $defined(current_folder))
		return;
		
	form.setStyle ('display', 'block');
	formShowed = form;
}

// click pe un folder
function folderClick (folder)
{
	if(!can_change) {
		alert ("You can't change the folder while uploading!");
		return;
	}
	
	var folder_name = folder.getText();
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
	var folder_name = changed_folder.getText().trim();
	// sets the action for the upload form
	$('upload_form').action = 'upload.php?dir=' + folder_name;
	// sets the file extensions for the upload form
	var ext = '';
	switch (folder_name) {
		case 'Images':
			ext = '\.jpg';
			break; 
		case 'Movies':
			ext = '\.flv';
			break;
		case 'Text':
			ext = '\.txt';
			break;
	} 
	multiUpload.setFileExtensions(ext);
	// check if we need to reset the upload form
	multiUpload.checkReset();
	
	// change the icons
	if ($defined(current_folder))
		current_folder.className = 'folder';
	changed_folder.className = 'folder-open';
	current_folder = changed_folder;
	
	// TODO: do this with JSON
	$('fileList').setHTML(reponseText);
	
	var files = $('fileList').getChildren();
	files.each(function(file){
		file.addEvent('mousedown', function(ev) {
			fileMousedown (file, ev);
			return false;
		});
	});
}

function uploadStart()
{
	can_change = false;
	$('uploadMsg').setStyle('display', 'block');
	$('uploadMsg').setHTML("<img src='img/loading_04.gif'/><span>Uploading...</span>");
}

// TODO: handle error cases
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

// mousedown pt. un fisier
function fileMousedown (file, ev)
{
	file_mousePos = ev.page;
	file_dragged = file;

	file_dragged.addEvents({
		'mousemove' : fileDragCheck, 
		'mouseup' : fileDragCancel
	});
	file_dragged.removeEvent ('mousedown', fileMousedown);
	
	return false;
}

// cancels the drag event
function fileDragCancel (ev)
{
	file_dragged.removeEvent('mousemove', fileDragCheck);
	file_dragged.removeEvent('mouseup', fileDragCancel);
	
	return false;
}

// checks if we can start dragging
function fileDragCheck (ev)
{
	var distance = Math.round(Math.sqrt(Math.pow(ev.page.x - file_mousePos.x, 2) 
		+ Math.pow(ev.page.y - file_mousePos.y, 2)));
	
	if (distance > 4) {
		ev = new Event(ev).stop();
		file_dragged.removeEvent('mousemove', fileDragCheck);
		// drop object
		var drop = $('trashFolder');
		// calculate the position
		var coord = file_dragged.getCoordinates();
		var scroll = $('fileList').getScroll();
		if(!window.opera)
			coord.top -= scroll.y;
		// clonez elementul	 
		var file_clone = file_dragged.clone()
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
				fileDragStop(file_dragged);
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
			'title': file.src
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
					fileMousedown (li, ev);
					return false;
				}
			}
		}
	);
	name_div.setText(file.name);
	thumb_div.adopt(thumb_img);
	li.adopt(thumb_div).adopt(name_div);
	$('fileList').adopt(li);
}

function init ()
{
	$('uploadButton').addEvent ('click', function () {
		showForm ($('uploadForm'));
	});

	// atasam ev. pt. "folders"
	var folders = $('folderList').getChildren();
	folders.each(function (folder) {
		folder.addEvents ({
			'click' : function() {
				if (folder.className != "trash")
					folderClick (this);
			},
			// urm. 2 ev. fac el. non-selectabil in IE
			'selectstart' : function () {
				return false;
			},
			'mousedown' : function () {
				return false;
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