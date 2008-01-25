/**
 * BUGS:
 * - drag & drop in IE, reason: .setStyles(this.getCoordinates()) 
 * - div-ul options apare peste obiectele mutate, solution: z-index
 */
 
// form-ul afisat
var formShowed = null;
// fisierul-ul selectat
var selectedFile = null;
// drag&drop - pozitia initiala
var file_dragStart = null;
	
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
function folderMouseOver (folder)
{
	if (folder.className == 'folder') {
		folder.removeClass ('folder');
		folder.addClass ('folder-hover');
	}
}

// mouseout deasupra unui folder
function folderMouseOut (folder)
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

// mousedown pt. un fisier
function file_mousedown (file, ev)
{
	file_dragStart = ev.page;
	file_ob = file;
	
	document.addEvents ({
		'mousemove' : file_drag_check,
		'mouseup' : file_drag_cancel
	});
}

function file_drag_check (ev)
{
	ve = new Event(ev).stop();
	
	var distance = Math.round(Math.sqrt(Math.pow(ev.page.x - file_dragStart.x, 2) + Math.pow(ev.page.y - file_dragStart.y, 2)));
	
	if (distance > 6){
		file_drag_cancel ();
		
		var drop = $('trashFolder');
		
		// clonez elementul	 
		var clone = file_ob.clone()
			.setStyles({'opacity': 0.7, 'position': 'absolute'})
			.setStyles(file_ob.getCoordinates()) 
			.addEvent('emptydrop', function() {
				this.remove();
			}).inject($('fileList'));
		
		var drag = clone.makeDraggable({
			droppables: [drop]
		}); 
		
		document.addEvent ('mouseup', function() {
			clone.destroy();
		});
	 
		drag.start(ev);
	}
}

function file_drag_cancel ()
{
	document.removeEvent('mousemove', file_drag_check);
	document.removeEvent('mouseup', file_drag_cancel);
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
				folderMouseOver (this);
			},
			'mouseout' : function () {
				folderMouseOut (this);
			},
			// drag & drop
			'over' : function () {
				folderMouseOver (this);
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
	var drop = $('trashFolder');
	
	files.each(function(file){
		file.addEvent('mousedown', function(ev) {
			file_mousedown (file, ev);
		});
	});
}

window.addEvent('domready', init);