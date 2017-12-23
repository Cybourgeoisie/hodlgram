// Configuration
var valid_uri_coins = ['BTC', 'LTC', 'DCR'];
var cryptocoin_logo = ['BTC', 'LTC', 'DCR-alt'];
var valid_uri_pages = ['create', 'verify', 'redeem'];

function boot() {
	// Startup logic
	setEvents();

	// Set the proper page
	handleNavigation(window.location.hash.substr(1) || "BTC&create");
}

function handleNavigation(uri_hash) {
	// Pull off the coin and page
	var uri_hash_els = uri_hash.split('&');
	var coin = uri_hash_els[0];
	var page = uri_hash_els[1];

	// Split off any parameters from the page
	var page_els = page.split('=');
	var page = page_els[0];
	var param = page_els[1];

	if (!coin || valid_uri_coins.indexOf(coin) === -1) {
		return;
	}

	if (!page || valid_uri_pages.indexOf(page) === -1) {
		page = 'create';
	}

	// Navigate
	showCoin(coin);
	showPage(page);

	// Special logic
	if (page == 'verify') {
		// Pull the current coin & generate verification address
		if (param) {
			$('.redeemscript-verify').val(param);
			decodeRedeemScript();
		}
	}
}

function showPage(page) {
	// Hide all existing pages
	$('.div-page').hide();

	// Show the requested page
	$('.div-page-' + page).show();

	// Make sure the coin button is active
	$('.page-toggle').removeClass('active');
	$('button[data-page="' + page + '"]').addClass('active');
}

function showCoin(coin) {
	// And remove all crypto classes and replace with called class
	$('.crypto-css').removeClass(valid_uri_coins.join(' '));
	$('.crypto-css').addClass(coin.toUpperCase());

	// Special cases - some cryptocoins look better in their "alt" versions
	$('.cryptocoin-logo').removeClass(cryptocoin_logo.join(' '));
	$('.cryptocoin-logo').addClass(cryptocoin_logo[valid_uri_coins.indexOf(coin)]);

	// Make sure the coin button is active
	$('ul.navbar-nav li').removeClass('active');
	var $parent_li = $('a[data-coin="' + coin + '"]').closest('li');
	$parent_li.addClass('active');
}

function setEvents() {
	// Hash change - change page
	window.onhashchange = function() {
		handleNavigation.call(this, window.location.hash.substr(1) || "BTC&create");
	}

	window.onclick = function() {
		return false;
	}

	// Enable intelligent hash changes when clicking on links
	$('.coin-toggle').click(changeCoinHash);
	$('.page-toggle').click(changePageHash);

	// Site Actions
	$('#generateRedeemScript').click(generateRedeemScript);
	$('#verifyRedeemScript').click(decodeRedeemScript);
	$('.copyButton').click(copyToClipboard);

	// Set up the unlock time selector
	var now = new Date();
	var $unlocktime = $('#unlocktime');
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

function copyToClipboard() {
	var elClass = $(this).data('copy-input');
	var el = $('.' + elClass)[0];
	el.select();
	document.execCommand("Copy");
}

function changeCoinHash() {
	// Pull the element and coin
	var $this = $(this);
	var coin = $this.data('coin');

	// Modify the hash to fit this coin
	var uri_hash_els = window.location.hash.substr(1).split('&');
	var page = (uri_hash_els.length > 1) ? uri_hash_els[1] : 'create';

	// Update the hash
	window.location.hash = '#' + coin + '&' + page;
}

function changePageHash() {
	// Pull the element and coin
	var $this = $(this);
	var page = $this.data('page');

	// Modify the hash to fit this coin
	var uri_hash_els = window.location.hash.substr(1).split('&');
	var coin = uri_hash_els[0] || 'BTC';

	// Update the hash
	window.location.hash = '#' + coin + '&' + page;
}
