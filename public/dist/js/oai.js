
var ContactMethods = (function() {

	function ContactMethods(viewport) {

		var self = this;

		this.viewport = viewport;
		this.navItems = [];

		this.navItemOnClick = function(ev) {
			ev.preventDefault();
			self.setActive(this.targetMethod);
			self.setCurrent(this);
		};

	}

	/* Display selected contact method content */

	ContactMethods.prototype.setActive = function(activeElement) {

		for (var i = this.navItems.length; i--; )
			this.navItems[i].viewport.targetMethod.classList.remove('is-active');

		activeElement.classList.add('is-active');

	};

	/* Highlight selected contact method nav tab */

	ContactMethods.prototype.setCurrent = function(currentElement) {

		for (var i = this.navItems.length; i--; )
			this.navItems[i].viewport.classList.remove('is-current');

		currentElement.classList.add('is-current');

	};

	ContactMethods.prototype.loadNavItems = function() {

		var elements = this.viewport.querySelectorAll('.ContactMethodsNavItem-select-area');

		for (var i = elements.length; i--; ) {

			elements[i].addEventListener('click', this.navItemOnClick, false);
			elements[i].targetMethod = document.getElementById(elements[i].dataset.target) || false;

			this.navItems.push({
				viewport: elements[i]
			});

		}

	};

	ContactMethods.prototype.init = function() {

		this.loadNavItems();

	};

	return ContactMethods;

})();

/*!
 * Mowe Webtal Project v1.0.0 (http://gomowe.org/)
 * Copyright 2013-2015 Noibe Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

/* Mowe Distinct v0.1.0 */

(function ($) {

	/* Constructor of distinct functions */
	$.fn.distinct = function (options) {

		var settings = $.extend({
			content: "",
			defaultClass: "",
			startName: "",
			target: "body"
		}, options);

		$(settings.target).addClass("slide-1");

		$(this).click(function(index) {
			var string = "";

			if(settings.startName){
				string = settings.startName + "-" + ($(this).index() + 1);
			} else {
				string = $(this).attr("id") + "-" + ($(this).index() + 1);
			}

			$(settings.target).attr("class", settings.defaultClass + " " + string);

			$(settings.content[$(this).index()]).index();

		});
	};

}(jQuery));

/* Mowe ScrollList v1.0.0 */

(function ($) {

	/* Constructor of scrollList functions */
	$.fn.scrollList = function (options) {

		var settings = $.extend({
			beforePadding: 0,
			startName: "",
			target: "body"
		}, options);

		var addressListSettings = {
			beforePadding: settings.beforePadding,
			parent: settings.target,
			startName: settings.startName
		};

		var addressList = $(this).getAddress(addressListSettings);
		var element = this;
		var pastActive;

		$(window).resize(function () {
			addressList = $(element).getAddress(addressListSettings);
		});

		$(window).scroll(function () {
			var active = $(this).getScrollActiveItem(addressList);

			if (active != pastActive) {
				if (!$(settings.target).hasClass(active)) {

					if ($(settings.target).hasClass(pastActive)) {
						$(settings.target).removeClass(pastActive);
					}

					$(settings.target).addClass(active);

					pastActive = active;
				}
			}
		});
	};

	/* Get What Scroll Item is Active */
	$.fn.getScrollActiveItem = function (addressList) {

		var currentLocal;

		for (i = 0; i < addressList.length; i++) {
			if (addressList[i].address < $(window).scrollTop()) {
				currentLocal = addressList[i].name;
			}
		}

		if (currentLocal) {
			return currentLocal;
		} else {
			return null;
		}

	};

	/* Get Address List Function */
	$.fn.getAddress = function (options) {

		//beforePadding attr works now
		//parent attr is nonfunctional (at this version)
		//startName attr is optional
		var settings = $.extend({
			addAddressAttr: true,
			beforePadding: 0,
			parent: "body",
			startName: ""
		}, options);

		//Initializing the address list array
		var addressList = [];

		if (!settings.name) {

			this.each(function (index) {

				var name = "";

				if (!settings.startName) {
					//default
					name = $(this).attr("id");
				} else {
					//when a startName attr was declared
					name = settings.startName + "-" + (index + 1);
				}

				//fill the address list
				addressList.push({
					name: name,
					address: this.offsetTop - settings.beforePadding
				});

				if (settings.addAddressAttr) {
					$(this).attr("data-scroll-target", name);
				}

			});

			return addressList;

		}
	};

}(jQuery));

(function ($) {

	/* Insert HTML content to element */
	$.fn.insertHTML = function (content) {
		for(var a = this.length; a--; ) {
			this[a].innerHTML += content;
		}
	};

}(jQuery));

/* external funcs */

function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;

	while (element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return {x: xPosition, y: yPosition};
}

//get scroll position from top
function getScrollTop() {
	if (typeof pageYOffset != 'undefined') {
		//most browsers except IE before #9
		return pageYOffset;
	}
	else {
		var B = document.body; //IE 'quirks'
		var D = document.documentElement; //IE with doctype
		D = (D.clientHeight) ? D : B;
		return D.scrollTop;
	}
}

//removes class with prefix
jQuery.fn.removeClassLike = function (prefix) {
	var classes = this.attr("class").split(" ").filter(function (c) {
		return c.lastIndexOf(prefix, 0) !== 0;
	});
	return this.attr("class", classes.join(" "));
};

/* START - INITIALIZERS */

/* Legacy/future implementation: price list plans manipulation */
//var pricelistContent = new PricelistContent(document.getElementById('pricelist-content'));

/* Contact methods initialization */
var contactMethods = new ContactMethods(document.getElementById('contact-methods'));
contactMethods.init();

/* Tawk chat initialization */
var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/591288d464f23d19a89b1743/default';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();

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
		var f = document.getElementById('fCpf').classList;
		(c.checked) ? f.add('is-true') : f.remove('is-true');
	}
);

/* MODULE */
/* Contact form data manipulation */

var formSentCount = 0;
var formSentCountLimit = 2;

var requestURL = 'http://mailman.letsmowe.com/oai/';

var formLocked = false;

var form = {
	viewport: document.getElementById('cForm')
};

form.fields = {};
form.sendButton = {};

form.fields.cName = document.getElementById('cName');
form.fields.cClient = document.getElementById('cClient');
form.fields.cCpf = document.getElementById('cCpf');
form.fields.cPhone = document.getElementById('cPhone');
form.fields.cEmail = document.getElementById('cEmail');
form.fields.cAddress = document.getElementById('cAddress');
form.fields.cCity = document.getElementById('cCity');
form.fields.cMessage = document.getElementById('cMessage');

form.sendButton.viewport = document.getElementById('cSubmit');

form.states = [
	'is-error',
	'is-fail',
	'is-sending',
	'is-success'
];

form.changeState = function (state) {

	if (form.viewport) {

		for (var i = form.states.length; i--; )
			form.viewport.classList.remove(form.states[i])

		form.viewport.classList.add(state);

	}

};

// send the ajax request
form.sendRequest = function(requestData) {

	if (requestData) {

		// ajax request
		$.ajax({
			cache: false,
			crossDomain: true,
			data: requestData,
			method: 'get',
			beforeSend: function() {

				formLocked = true;
				form.changeState('is-sending');

			},
			error: function (data) {

				console.log(data);

				form.changeState('is-fail');
				form.send(requestData, 5000);

			},
			success: function (data) {

				console.log(data);

				if (data.sent)
					form.changeState('is-success');
				else
					form.changeState('is-error');

				formLocked = false;

			},
			timeout: 12000,
			url: requestURL
		});

	}

};

// control the time delay to init the ajax request
form.send = function(requestData, delay) {

	if (requestData) {

		if (delay) {

			setTimeout(function() {

				form.sendRequest(requestData);

			}, delay)

		} else {

			form.sendRequest(requestData);

		}

	}

};

// form submit button listener
form.sendButton.viewport.addEventListener('click', function (ev) {

	ev.preventDefault();

	if (!formLocked) {

		if (formSentCount < formSentCountLimit) {

			var allow = !!(form.fields.cName.value && (form.fields.cPhone.value || form.fields.cEmail.value) && (form.fields.cAddress.value || form.fields.cCity.value) && form.fields.cMessage.value);

			if (allow) {

				// lock the form
				formLocked = true;

				// count the request
				formSentCount++;

				// get object data
				var requestData = {
					cName: form.fields.cName.value,
					cPhone: form.fields.cPhone.value,
					cEmail: form.fields.cEmail.value,
					cAddress: form.fields.cAddress.value,
					cCity: form.fields.cCity.value,
					cMessage: form.fields.cMessage.value
				};

				// send
				form.send(requestData, false);


			} else {

				form.changeState('is-error');

			}

		}

	}

});

/* END - MODULES */