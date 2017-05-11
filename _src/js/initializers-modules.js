
/* START - INITIALIZERS */

/* Legacy/future implementation: price list plans manipulation */
//var pricelistContent = new PricelistContent(document.getElementById('pricelist-content'));

/* Contact methods initialization */
var contactMethods = new ContactMethods(document.getElementById('contact-methods'));
contactMethods.init();

/* Tawk chat initialization */
// var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/591288d464f23d19a89b1743/default';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();

/* END - INITIALIZERS */

/* START - MODULES */

/* MODULE */
/* Zoom map when city is selected */

var cities = document.querySelectorAll('.CitiesItem-select-area');

for (var i  = cities.length; i--; )
	cities[i].addEventListener('click', function() {

		var lat = parseFloat(this.dataset.maplat) || false;
		var lng = parseFloat(this.dataset.maplng) || false;
		var zoom = parseFloat(this.dataset.mapzoom) || false;

		if (lat && lng)
			map.setCenter(new google.maps.LatLng({lat: lat, lng: lng}));

		map.setZoom(!!zoom ? zoom: 16);

	});

/* MODULE */
/* Manage event triggers */

function addEvent(el, ev, func) {
	var list = [];
	for (var i = 0; i < el.length; i++)
		list[i] = (!el[i].attachEvent) ? el[i].addEventListener(ev, func, false) : el[i].attachEvent('on' + ev, func);
	return list;
}

addEvent(
	document.querySelectorAll('#toggle-mobile'),
	'click',
	function () {
		var menu = document.getElementById('menu');
		menu.classList.toggle('show');
	}
);

addEvent(
	document.querySelectorAll('#menu .item a'),
	'click',
	function () {
		var menu = document.getElementById('menu').classList;
		(menu.contains('show')) ? menu.remove('show') : false;
	}
);

addEvent(
	document.querySelectorAll('#cClient'),
	'click',
	function () {
		var c = document.getElementById('cClient');
		var f = document.getElementById('fCpf');
		document.getElementById('cCpf').value = "";
		(c.checked) ? f.classList.add('is-true') : f.classList.remove('is-true');
	}
);

/* END - MODULES */