// TODO: sa verific extensia fisierului adaugat!
var MultiUpload = new Class({
	initialize: function(input_element) {
		// check if it's a input file element
		if (!(input_element.tagName == 'INPUT' && input_element.type == 'file')) {
			alert("MultiUpload: Error! not a file input element!"); 
		}
		
		// list of elements
		this.elements = [];
		// last id
		this.lastid = 0;
		
		// add element methods
		$(input_element);
		
		// save the active input
		this.active_input = input_element;
		
		this.initializeElement (input_element);
		
		// Files list
		var container = new Element(
			'div', {
				'class': 'multiupload'
			}
		);
		this.list = new Element(
			'div', {
				'class':'list'
			}
		);
		// file inputs
		var fileinputs = new Element(
			'div', {
				'class':'fileinputs'
			}
		);
		// fake input file
		var fake_input = new Element(
			'div', {
				'class':'fakefile',
			}
		);
		fileinputs.injectAfter(input_element);
		fileinputs.adopt(fake_input);
		fileinputs.adopt(input_element);
		
		container.injectAfter(fileinputs);
		container.adopt(fileinputs);
		container.adopt(this.list);
	},
	initializeElement: function(element) {
		element.addClass('realfile');
		element.addEvent(
			'change',
			function(){
				this.addElement (element);
			}.bind(this)
		);
		this.lastid++;
	},
	addElement: function(element) {
		var name = element.value;
		
		// extract file name
		if (name.search("\/")) {
			name = name.substring(name.lastIndexOf("\\") + 1);
		}
		if (name.search("//")) {
			name = name.substring(name.lastIndexOf('/') + 1);
		}
		
		// the id of the new element
		var id = this.lastid;
		
		var span = new Element('span').setText( name );
		var img_ext = new Element(
			'img',
			{
				'src':'img/cross_small.gif',
				'class':'ext',
				'alt':'Delete',
				'title':'Delete',
				'events':{
					'click':function(){
						this.deleteElement (id);
					}.bind(this)
				}
			}
		);
		var img_delete = new Element(
			'img',
			{
				'src':'img/cross_small.gif',
				'class':'delete',
				'alt':'Delete',
				'title':'Delete',
				'events':{
					'click':function(){
						this.deleteElement (id);
					}.bind(this)
				}
			}
		);
		var row = new Element(
			'div', {
				'class':'item'
			}
		).adopt(img_ext).adopt(img_delete).adopt(span);
		
		this.list.adopt(row);
		
		this.elements[this.lastid] = {
			'file': element,
			'item':  row
		};
		
		// Create new file input element
		var new_input = new Element (
			'input',
			{
				'type': 'file',
				'disabled': false
			}
		);
		this.initializeElement(new_input);
		
		element.style.position = 'absolute';
		element.style.left = '-1000px';
		new_input.injectAfter (element);
		this.active_input = new_input;
	},
	deleteElement: function(id) {
		this.elements[id].file.remove();
		this.elements[id].item.remove();
	}
});