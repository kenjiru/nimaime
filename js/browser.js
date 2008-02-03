// form-ul afisat
var formShowed = null;
// drag&drop - pozitia initiala
var file_mousePos = null;
var file_dragged = null;
var file_clone = null;
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
	form.setStyle ('display', 'block');
	formShowed = form;
}

// mouseover deasupra unui folder
function folderMouseover (folder)
{
	if (folder.className == 'folder') {
		folder.removeClass ('folder');
		folder.addClass ('folder-hover');
	}
}

// mouseout deasupra unui folder
function folderMouseout (folder)
{
	if (folder.className == 'folder-hover') {
		folder.removeClass ('folder-hover');
		folder.addClass ('folder');
	}
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
}

function uploadResponse(files)
{
	can_change = true;
	$each(files, function(file){
		addFile(file);
	});
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
	file_dragged.addEvent ('mousedown', false);
	
	return false;
}

// cancels the drag event
function fileDragCancel (ev)
{
	file_dragged.removeEvent('mousemove', fileDragCheck);
	file_dragged.removeEvent('mouseup', fileDragCancel);
	file_dragged.removeEvent('mousedown', false);
	
	return false;
}

// checks if we can start dragging
function fileDragCheck (ev)
{
	var distance = Math.round(Math.sqrt(Math.pow(ev.page.x - file_mousePos.x, 2) 
		+ Math.pow(ev.page.y - file_mousePos.y, 2)));
	
	if (distance > 2) {
		fileDragCancel ();

		var drop = $('trashFolder');
		
		// clonez elementul	 
		file_clone = file_dragged.clone()
			.setStyles({'opacity': 0.7, 'position': 'absolute'})
			.setStyles(file_dragged.getCoordinates()) 
			.addEvent('emptydrop', function() {
				file_clone.remove();
			}).inject($('fileList'));
		
		drop.addEvents({
			'drop': function() {
				drop.removeEvents();
				file_clone.remove();
				file_dragged.remove();
				
				drop.removeClass ('trash-full');
				drop.addClass ('trash');
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
			droppables: [drop]
		}); 
		
		drag.start(ev);
	}

	return false;
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
		}
	);
	var name_div = new Element(
		'div', {
			'class': 'name'
		}
	);
	var li = new Element(
		'li', {
			'class': 'file'
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
			'mouseover' : function () {
				folderMouseover (this);
			},
			'mouseout' : function () {
				folderMouseout (this);
			},
			// drag & drop
			'over' : function () {
				folderMouseover (this);
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
	
	multiUpload = new MultiUpload($('upload_form').getElementsByTagName('input')[0], "(\.jpg)|(\.png)");
	multiUpload.addEvents({
		'onStart': uploadStart,
		'onResponse': uploadResponse
	});
}

window.addEvent('domready', init);