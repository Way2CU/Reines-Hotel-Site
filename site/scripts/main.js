/**
 * Main JavaScript
 * Reines Hotel
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {
	if (Site.is_mobile())
		Site.mobile_menu = new Caracal.MobileMenu();

	// image gallery
	Site.gallery = new Caracal.Gallery.Slider(4, false);
	Site.gallery
		.images.set_container(document.querySelector('section#gallery div'))
		.images.set_center(false)
		.images.set_spacing(10)
		.controls.attach_next(document.querySelector('section#gallery a.next'))
		.controls.attach_previous(document.querySelector('section#gallery a.previous'))
		.images.update();

	// dynamic image loader
	Site.image_loader = new Caracal.Gallery.Loader();
	Site.image_loader
		.add_gallery(Site.gallery)
		.set_thumbnail_size(300)
		.load_by_group_text_id('first')
		.add_callback(function() {
			Site.lightbox = new LightBox('section#gallery a.image', true, false, true);
		});

	// handle clicks on gallery menu items
	Site.active_gallery = null;
	var items = document.querySelectorAll('section#gallery nav a');
	for (var i=0, count=items.length; i < count; i++) {
		var menu_item = items[i];
		menu_item.addEventListener('click', Site.handle_gallery_click);

		if (menu_item.dataset.textId == 'first') {
			menu_item.classList.add('active');
			Site.active_gallery = menu_item;
		}
	}

	// create map
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
			center: {lat: 32.079048, lng: 34.774704},
			zoom: 17,
			scrollwheel: false
		};

	var map = new google.maps.Map(mapCanvas, mapOptions);

	new google.maps.Marker({
			position:{lat: 32.079048, lng: 34.774704},
			map: map,
			title: "Reines Hotel"
		});

};

/**
 * Handle clicking on gallery menu item.
 *
 * @param object event
 */
Site.handle_gallery_click = function(event) {
	var gallery_id = event.target.dataset.id;
	Site.image_loader.load_by_group_id(gallery_id);

	Site.active_gallery.classList.remove('active');
	Site.active_gallery = event.target;
	Site.active_gallery.classList.add('active');
}

$(Site.on_load);
