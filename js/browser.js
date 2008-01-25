/**
 * About: 
 * - implements drag and drop for the file list
 * 
 * Bugs:
 * - when you click on a file, without dragging it, a new copy is created
 */
// form-ul afisat
var formShowed = null;
// fisierul-ul selectat
var selectedFile = null;
	
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

function selectFile (file)
{
	if ($defined(selectedFile)) {
		selectedFile.removeClass ("selected");
	}
	
	var thumb = file.getElement(".thumb");
	thumb.addClass ("selected");
	
	selectedFile = thumb;
}

function fileMousedown (file, ev)
{
	file.removeEvent ('mousedown', fileMousedown);
	file.addEvent ('mousedown', false);
	
	ev = new Event(ev).stop();
	var drop = $('trashFolder');

	// clonez elementul	 
	var clone = file.clone()
		.setStyles({'opacity': 0.7, 'position': 'absolute'})
		.setStyles(file.getCoordinates()) 
		.addEvent('emptydrop', function() {
			drop.removeEvents();
			clone.remove();
		}).inject($('fileList'));
 
	drop.addEvents({
		'drop': function() {
			drop.removeEvents();
			clone.remove();
			file.remove();
			
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
 
	var drag = clone.makeDraggable({
		droppables: [drop]
	}); 
 
	drag.start(ev); 
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
	
	// sortables
/*	var s = new Sortables($('fileList'));
	
	var files = $("fileList").getChildren();
	files.each(function (file) {
		file.addEvent ('mousedown', function () {
			selectFile (this);
		});
	});
*/	
	var files = $('fileList').getChildren();
	
	files.each(function(file){
		file.addEvent('mousedown', function(ev) {
			fileMousedown (file, ev);
			return false;
		});
	});
}

window.addEvent('domready', init);