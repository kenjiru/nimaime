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

function init ()
{
	// atasam ev. pt. "optionsMenu"
/*	$('detailsButton').addEvent ('click', function () {
		showForm ($('detailsForm'));
	});

	$('uploadButton').addEvent ('click', function () {
		showForm ($('uploadForm'));
	});
*/
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
	var s = new Sortables($('fileList'));
	
	var files = $("fileList").getChildren();
	files.each(function (file) {
		file.addEvent ('mousedown', function () {
			selectFile (this);
		});
	});
}

window.addEvent('domready', init);