// Configuration
var valid_uri_hashes = ['btc', 'ltc'];

function boot() {
	// Startup logic
	setEvents();

	// Set the proper page
	handleNavigation(window.location.hash.substr(1) || "btc");
}

function handleNavigation(uri_hash) {
	// Pull off any parameters
	var uri_hash_els = uri_hash.split('=');
	var uri = uri_hash_els[0];
	var uri_param = uri_hash_els[1];

	if (!uri_hash || valid_uri_hashes.indexOf(uri) === -1) {
		return;
	}

	// Navigate
	if (uri == 'btc') {
		showPage('btc');
	} else if (uri == 'ltc') {
		showPage('ltc');
	}
}

function showPage(uri) {
	// Hide all existing pages
	$('.div-page').hide();

	// Show the requested page
	$('.div-page-' + uri).show();

	// Make sure the navigation button is active
	$('ul.navbar-nav li').removeClass('active');
	var $parent_li = $('a[href="#' + uri + '"]').closest('li');
	$parent_li.addClass('active');

	// And remove all crypto classes and replace with called class
	$('.crypto-css').removeClass('btc ltc');
	$('.crypto-css').addClass(uri);
}

function setEvents() {
	// Hash change - change page
	window.onhashchange = function() {
		handleNavigation.call(this, window.location.hash.substr(1) || "home");
	}

	// Set up the unlock time selector
	var now = new Date();
	var $unlocktime = $('.unlocktime');
	$unlocktime.val(now.toLocaleString('en-US'));
	$unlocktime.daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		timePicker: true,
		timePickerIncrement: 1,
		locale: {
			format: 'MM/DD/YYYY h:mm A'
		}
	});
}