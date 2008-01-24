var formShowed = null;
	
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
	var folders = $('rootList').getChildren();
	folders.each(function (folder) {
		folder.addEvent ('mouseover', function () {
			folderMouseOver (this);
		});
		folder.addEvent ('mouseout', function () {
			folderMouseOut (this);
		});
		
		// face el. non-selectabil, IE specific
		folder.addEvent ('selectstart', function () {
			return false;
		});
		folder.addEvent ('mousedown', function () {
			return false;
		});
	});
}

window.addEvent('domready', init);