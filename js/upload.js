var MultiUpload = new Class({
	options: {
		onStart: Class.empty,
		onResponse: Class.empty,
		onNewSession: Class.empty
	},
	/* Class constructor */
	initialize: function(upload_iframe, input_element, file_ext) {
		// check if it's a input file element
		if (!(input_element.tagName == 'INPUT' && input_element.type == 'file')) {
			alert("MultiUpload: Error! not a file input element!");
			return null; 
		}
		if (!$defined(upload_iframe)) {
			alert("You need to specify an upload iframe!");
			return null;
		}
		if ($defined(file_ext)) {
			this.file_ext = file_ext;
		}
		this.upload_iframe = upload_iframe;
		this.name = input_element.name;
		this.elements = []; // list of elements
		this.lastid = 0; // last id
		this.needs_cleanup = false; // needs_cleanup executed, things need cleanup
		
		$(input_element); // add element methods
		this.initializeElement (input_element);
		
		// files list
		var container = new Element(
			'div', {
				'class': 'multiupload'
			}
		);
		// list of file names
		this.list = new Element('ul');
		// the submit button
		this.submit = new Element(
			'input', {
				'type':'submit',
				'value':'Upload',
				'class':'submit',
				'events': {
					'click': function() {
						this.uploadStart();
						return false;
					}.bind(this)
				}
			}
		);
		container.injectAfter(input_element);
		container.adopt(this.upload_results);
		container.adopt(input_element);
		container.adopt(this.submit);
		container.adopt(this.list);
	},
	/* Initializes the file input */
	initializeElement: function(element) {
		element.addClass('file');
		element.addEvent(
			'change',
			function(){
				this.addElement (element);
			}.bind(this)
		);
		this.last_input = element;
		this.lastid++;
	},
	/* Adds a file to the list */
	addElement: function(element) {
		var name = element.value;
		// extract file name
		if (name.search("\/")) {
			name = name.substring(name.lastIndexOf("\\") + 1);
		}
		if (name.search("//")) {
			name = name.substring(name.lastIndexOf('/') + 1);
		}
		// check the extension
		var ext = name.substring(name.lastIndexOf('.')+1);
		if (this.file_ext.search(ext) == -1) {
			alert ("Invalid file type, you have to choose a " + this.file_ext + " file");
			return;
		}
		// clean the file list if needed
		if (this.needs_cleanup) {
			this.fireEvent('onNewSession');
			this.reset();
		}
		// the id of the new element
		var id = this.lastid;
		var span = new Element('span').setText( name );
		var img_delete = new Element(
			'img', {
				'src': 'img/tango-remove.png',
				'class': 'delete',
				'alt': 'Delete',
				'title': 'Delete',
				'events': {
					'click': function(){
						this.deleteElement (id);
					}.bind(this)
				}
			}
		);
		// determine the icon for the file
		var ext_class = '';
		switch(ext) {
			case 'jpg':
				ext_class = 'image';
				break;
			case 'txt':
				ext_class = 'text';
				break;
			case 'flv':
				ext_class = 'video';
				break;
		}
		var li = new Element('li',
			{
				'class': ext_class
			});
		li.adopt(img_delete).adopt(span);
		
		this.list.adopt(li);
		
		this.elements[this.lastid] = {
			'file': element,
			'item': li
		};
		
		// Create new file input element
		new_input = new Element (
			'input', {
				'type': 'file',
				'name': this.name,
				'disabled': false
			}
		);
		this.initializeElement(new_input);
		
		element.style.display = 'none';
		element.style.position = 'absolute';
		element.style.left = '-1000px';
		element.style.display = 'block';
		new_input.injectAfter(element);
	},
	/* Deletes a file from the list */
	deleteElement: function(id) {
		this.elements[id].file.remove();
		this.elements[id].item.remove();
		this.elements[id].file = null;
		this.elements[id].item = null;
	},
	/* Starts the file uploading */
	uploadStart: function() {
		this.last_input.disabled = true;
		this.submit.disabled = true;
		this.needs_cleanup = true;
		// handle iframe's onload event
		this.upload_iframe.addEvent('load', this.uploadResponse.bind(this));
		// Opera hack
		$('upload_form').submit(); 
		this.fireEvent('onStart');
	},
	/* Fired when we get the results for the upload */
	uploadResponse: function() {
		this.last_input.disabled = false;
		this.submit.disabled = false;
		this.upload_iframe.removeEvents();
		this.reset();
		// fire the event
		this.fireEvent('onResponse');
	},
	/* Set new file extension for the upload files */
	setFileExtensions: function(file_ext) {
		this.file_ext = file_ext;
	},
	/* Clears everything */
	reset: function() {
		// delete all the file input elements
		$each(this.elements, function(element) {
			if ($defined(element.file)) {
				element.file.remove();
			}
			if ($defined(element.item)) {
				element.item.remove();
			}
		});
		// resets all the variables
		this.elements = []; 
		this.lastid = 0; 
		this.needs_cleanup = false;
	},
	/* Check if a reset is needed */
	checkReset: function() {
		if(this.lastid != 0) {
			this.reset();
		}
	}
});

// implements Events and Options features
MultiUpload.implement(new Events, new Options);