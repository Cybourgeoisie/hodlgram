function generateRedeemScript() {
	// Get the date and time from the unlocktime parameter
	$unlocktimeDRP = $('#unlocktime').data('daterangepicker');
	if (!$unlocktimeDRP) {
		return;
	}

	// Get time & pub key
	var nLockTime = $unlocktimeDRP.startDate._d.getTime()/1000;
	var pubKey = $("#publickey").val();

	// Validate
	var error_msg = false;
	if (pubKey.length < 1) {
		error_msg = 'Please enter a public key.';
	} else if (!pubKey.startsWith('02') && !pubKey.startsWith('03') && !pubKey.startsWith('04')) {
		error_msg = 'Please enter a valid compressed or uncompressed public key.';
	} else if ((pubKey.startsWith('02') || pubKey.startsWith('03')) && pubKey.length != 66) {
		error_msg = 'Compressed public keys must be 66 characters long.';
	} else if (pubKey.startsWith('04') && pubKey.length != 130) {
		error_msg = 'Uncompressed public keys must be 130 characters long.';
	}

	// Display an error if one is generated
	$('.div-page-create .error-message').html('').hide();
	if (error_msg) {
		$('.div-page-create .error-message').html(error_msg).show();
		return;
	}

	var hodl = coinjs.simpleHodlAddress(pubKey, nLockTime);

	// Pull the current coin & generate verification address
	var uri_hash_els = window.location.hash.substr(1).split('&');
	var coin = uri_hash_els[0] || 'BTC';
	var verifyUriHash = '#' + coin + '&verify=' + hodl['redeemScript'];

	$(".publicaddress-generated").val(hodl['address']);
	$(".redeemscript-generated").val(hodl['redeemScript']);
	$(".verifyurl-generated").val(document.location.origin+''+document.location.pathname+''+verifyUriHash);

	// Now hide the creation window and display the generated one
	$('.div-page-create').hide();
	$('.div-page-generated').show();
}

function decodeRedeemScript() {
	var script = coinjs.script();
	var decode = script.decodeRedeemScript($(".redeemscript-verify").val());
	if(decode){
		if(decode.type == "hodl__") {
			$(".publicaddress-verify").val(decode['address']);
			$(".reqsig-verify").val(coinjs.pubkey2address(decode['pubkey']));
			$(".unlocktime-verify").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY h:mm A") : decode['checklocktimeverify']);
			return true;
		}
	}
	return false;
}
