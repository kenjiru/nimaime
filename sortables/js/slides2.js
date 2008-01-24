// slide-ul selectat
var selectedSlide = null;

function SelectSlide (slide)
{
	if ($defined(selectedSlide)) {
		selectedSlide.removeClass ("selected");
	}
	
	var thumb = slide.getElement(".thumb");
	thumb.addClass ("selected");
	
	selectedSlide = thumb;
}

function init ()
{
	alert ("salut!");
	new Sortables($('slideshow'));
	
	// ataseaz ev. 'click' elem. cu id-ul 'slideshow'
//	$('slideshow').addEvent('click', slideshow_onClick);

	// ataseaz ev. 'click' elem. care au clasa 'slide'
	var slides = $$("#slideshow .slide");
	slides.each(function (slide) {
			slide.addEvent ('mousedown', function () {
				SelectSlide (this);
			});
		});
}

window.addEvent('domready', init);