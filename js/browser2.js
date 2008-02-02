// form-ul afisat
var formShowed = null;
// drag&drop - pozitia initiala
var file_mousePos = null;
var file_dragged = null;
var file_clone = null;
/* folder list variables */
var current_folder = null;

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
	var dir = folder.getText();
	var url = 'cmds.php?action=ls&dir=' + dir;
	
	var myRequest = new Request({
		'url' : url, 
		'method' : 'get',
		'onSuccess' : function(reponseText, responseXML) {
			current_folder = dir;
			folderLoad(reponseText, responseXML);
		}
	}).send();
}

function folderLoad (reponseText, responseXML)
{
	// sets the action for the upload form
	// sets the file extensions for the upload form
	
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

function init ()
{
	// atasam ev. pt. "optionsMenu"
/*	$('detailsButton').addEvent ('click', function () {
		showForm ($('detailsForm'));
	});
*/
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
}

window.addEvent('domready', init);