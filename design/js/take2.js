var formShowed = null;
	
	function showForm (form) 
	{
		// daca este activ un form
		if ($defined (formShowed)) {
			formShowed.setStyle ('display', 'none');
			if (formShowed == form) {
				formShowed = null;
				resizeLeftPanel ();
				return;
			}
			formShowed = null;
		}
		form.setStyle ('display', 'block');
		formShowed = form;
		
		resizeLeftPanel ();
	}
	
	function resizeLeftPanel ()
	{
		var rightHeight = $('rightPanel').getCoordinates().height;
		var rightHeight2 = $('rightPanel').getStyle('height');
		
		$('leftPanel').setStyle('height', rightHeight2);
	}
	
	function init ()
	{
		$('detailsButton').addEvent ('click', function () {
			showForm ($('detailsForm'));
		});
		$('uploadButton').addEvent ('click', function () {
			showForm ($('uploadForm'));
		});
		
		resizeLeftPanel ();
	}
	
	window.addEvent('domready', init);