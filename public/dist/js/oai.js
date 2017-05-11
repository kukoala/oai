/*!
 * Mowe Functions v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

/**
 * Add event listeners to element
 * @param param
 */
function addListener(param) {

	var el = param.element;
	var t = param.type;
	var ct = param.crossType;
	var l = param.listener;
	var uc = param.uc;

	if (window.addEventListener)
		el.addEventListener(t, l, !!uc);
	else el.attachEvent(ct ? ct : t, l);

}
/* Scroll */

var Anchor = (function () {

	/**
	 * Anchor class constructor
	 * @constructor
	 */
	function Anchor(element, options) {

		var self = this;

		this.element = element;

		//this.duration = options.duration;
		//this.easing = options.easing;
		//this.callback = options.callback;
		//this.scrollOffset = options.scrollOffset;

		this.duration = (typeof options.duration !== 'undefined') ? options.duration : 200;
		this.easing = (typeof options.easing !== 'undefined') ? options.easing : 'linear';
		this.callback = (typeof options.callback !== 'undefined') ? options.callback : false;
		this.scrollOffset = (typeof options.scrollOffset !== 'undefined') ? options.scrollOffset : 0;

		this.defaultBehavior = (typeof options.defaultBehavior !== 'undefined') ? options.defaultBehavior : false;
		this.trigger = (typeof options.trigger !== 'undefined') ? options.trigger : null;

		this.push = function () {

			self.start = this.bodyElement.scrollTop;
			self.startTime = Date.now();

			// Height checks to prevent requestAnimationFrame from infinitely looping
			// If the function tries to scroll below the visible document area
			// it should only scroll to the bottom of the document
			self.documentHeight = self.getDocumentHeight();
			self.windowHeight = self.getWindowHeight();
			self.destinationPosition = self.getDestinationPosition();

			self.animate();

		};

		this.defaultFunction = function (e) {
			document.activeElement.blur();
			e.preventDefault();
			self.push();
		};

		if (this.element)
			this.init();

	}

	/**
	 * Returns document.documentElement for Chrome and Safari
	 * document.body for rest of the world
	 *
	 * @return body DOM element
	 */
	Anchor.prototype.checkBody = function () {

		document.documentElement.scrollTop += 1;
		var body = (document.documentElement.scrollTop !== 0) ? document.documentElement : document.body;
		document.documentElement.scrollTop -= 1;

		return body;

	};

	/**
	 * Choose what easing function to use
	 * @param easing String
	 * @param t Integer
	 */
	Anchor.prototype.easingOption = function (easing, t) {

		switch (easing) {

			case 'linear':
				return t;
				break;

			case 'easeInQuad':
				return t * t;
				break;

			case 'easeOutQuad':
				return t * (2 - t);
				break;

			case 'easeInOutQuad':
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				break;

			case 'easeInCubic':
				return t * t * t;
				break;

			case 'easeOutCubic':
				return (--t) * t * t + 1;
				break;

			case 'easeInOutCubic':
				return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
				break;

			case 'easeInQuart':
				return t * t * t * t;
				break;

			case 'easeOutQuart':
				return 1 - (--t) * t * t * t;
				break;

			case 'easeInOutQuart':
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
				break;

			case 'easeInQuint':
				return t * t * t * t * t;
				break;

			case 'easeOutQuint':
				return 1 + (--t) * t * t * t * t;
				break;

			case 'easeInOutQuint':
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
				break;

			default:
				return t * t;
				break;

		}

	};


	/**
	 * Animate the body element until destination
	 */
	Anchor.prototype.animate = function () {

		var self = this;

		var now = Date.now();
		var time = Math.min(1, ((now - this.startTime) / this.duration));
		var timeFunction = this.easingOption(this.easing, time);
		this.bodyElement.scrollTop = (timeFunction * (this.destinationPosition - this.start)) + this.start;

		if (this.bodyElement.scrollTop === this.destinationPosition) {
			return;
		}

		requestAnimationFrame(function () {

			self.animate();

		});

	};

	Anchor.prototype.getDestinationPosition = function () {

		return ( this.documentHeight - this.element.offsetTop < this.windowHeight ? this.documentHeight - this.windowHeight : this.element.offsetTop ) + this.scrollOffset;

	};

	Anchor.prototype.getWindowHeight = function () {

		return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

	};

	Anchor.prototype.getDocumentHeight = function () {

		return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

	};

	Anchor.prototype.addListeners = function () {

		addListener({
			element: this.trigger,
			type: 'click',
			crossType: 'onclick',
			listener: this.defaultFunction
		});

	};

	Anchor.prototype.init = function () {

		this.bodyElement = this.checkBody();

		if (this.defaultBehavior)
			this.addListeners();

	};

	return Anchor;

})();

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
 * Elbit Contact v2.0.0 (http://elbit.com.br/)
 * Copyright 2016-2017 Elbit Digital Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
 */

/**
 * Constructor of Contact
 * Needs of jQuery Ajax (>1.11.3)
 * @param viewport
 * @param feedback
 * @param options
 * @constructor menu
 */
function Contact(viewport, feedback, options) {

	var self = this;

	this.viewport = viewport;
	this.feedback = feedback;

	this.url = !!options.url ? options.url : false;

	this.data = {};

	this.fields = {};

	this.tries = 0;
	this.maxTries = 3;

	this.clickCtrl = function(e) {

		self.initResponse(this);
		e.preventDefault();

	};

	this.states = [
		'is-error',
		'is-fail',
		'is-sending',
		'is-success',
		'is-incomplete',
		'is-invalid'
	];

	this.changeState = function (param) {

		/**
		 * @param [state, message]
		 */

		if (this.viewport) {

			for (var i = this.states.length; i--; )
				this.viewport.classList.remove(this.states[i])

			this.viewport.classList.add(param.state);

			if (param.message)
				this.feedback.innerText = param.message;
				// this.feedback.innerHTML = "<span class='ContactFormStatus-text ContactFormStatus-text--invalid'>" + param.message +  "</span>";

		}

	};

	this.asyncSuccessCtrl = function(data) {

		if (data.sent)
			self.showSuccessMessage();
		else
			self.showFailMessage();

	};

	this.asyncErrorCtrl = function(data) {

		this.tries = this.tries + 1;

		if(this.tries <= this.maxTries)
			self.retry(this.tries);
		else
			self.showErrorMessage();

	};

}



Contact.prototype.showSuccessMessage = function() {

	// console.log('enviado');
	this.changeState({state: 'is-success'});
	this.submit.disabled = true;

};

Contact.prototype.showFailMessage = function() {

	// console.log('completou, mas ocorreu uma falha');
	this.changeState({state: 'is-fail'});

};

Contact.prototype.showErrorMessage = function() {

	this.changeState({state: 'is-error'});

};

Contact.prototype.showRequiredMessage = function(mailError) {

	if (mailError) {

		document.querySelectorAll('.email-text')[0].focus();

		this.changeState({state: 'is-invalid', message: 'E-mail preenchido incorretamente'});

	} else {

		this.changeState({state: 'is-invalid', message: 'Preencha todos os campos'});

	}

};

Contact.prototype.send = function() {

	// console.log('enviando');
	this.changeState({state: 'is-sending'});

	$.ajax({
		url: this.url,
		type: 'jsonp',
		cache: false,
		data: this.data,
		method: 'get',
		timeout: 30000,
		success: this.asyncSuccessCtrl,
		error: this.asyncErrorCtrl
	});

};

Contact.prototype.retry = function(tries) {

	// console.log('tentando enviar novamente');

	$.ajax({
		url: this.url,
		type: 'jsonp',
		cache: false,
		data: this.data,
		method: 'get',
		timeout: 30000,
		success: this.asyncSuccessCtrl,
		error: this.asyncErrorCtrl
	});

};

Contact.prototype.initSend = function() {

	this.send();

};

Contact.prototype.loadTextFieldValue = function(element) {

	if (element == this.fields.client)
		return element.checked;

	return element ? element.value : false;

};

Contact.prototype.loadFieldsData = function(initSend) {

	this.data.name = this.loadTextFieldValue(this.fields.name);
	this.data.client = this.loadTextFieldValue(this.fields.client);
	this.data.cpf = this.loadTextFieldValue(this.fields.cpf);
	this.data.phone = this.loadTextFieldValue(this.fields.phone);
	this.data.email = this.loadTextFieldValue(this.fields.email);
	this.data.address = this.loadTextFieldValue(this.fields.address);
	this.data.city = this.loadTextFieldValue(this.fields.city);
	this.data.message = this.loadTextFieldValue(this.fields.message);

	if (initSend) this.initSend();

};

Contact.prototype.validateTextField = function(element) {

	return element ? element.value !== '' : false;

};

Contact.prototype.validateFields = function() {

	return !(!this.validateTextField(this.fields.name)
	// || !this.validateTextField(this.fields.client)
	// || !this.validateTextField(this.fields.cpf)
	|| !this.validateTextField(this.fields.phone)
	|| !this.validateTextField(this.fields.email)
	|| !this.validateTextField(this.fields.address)
	|| !this.validateTextField(this.fields.city)
	|| !this.validateTextField(this.fields.message));

};

Contact.prototype.initResponse = function(event) {

	if (this.validateFields()) {
		if (this.fields.email.validity) {
			if (this.fields.email.validity.valid) {
				if (this.fields.client.checked) {
					if (this.validateTextField(this.fields.cpf)) {
						if (this.fields.cpf.value.length == 11) {
							this.loadFieldsData(true);
						} else {
							this.changeState({state: 'is-invalid', message: 'Seu CPF deve conter 11 números.'});
						}
					} else {
						this.changeState({state: 'is-invalid', message: 'Se você já é cliente OAI, precisa informar seu CPF.'});
					}
				} else {
					this.loadFieldsData(true);
				}
			} else {
				this.showRequiredMessage(true);
			}
		} else {
			//validate only if it have validity object (supports email input type)
			this.loadFieldsData(true);
		}
	} else {
		this.showRequiredMessage(false);
	}

};

Contact.prototype.addListeners = function() {

	addListener({
		element: this.submit,
		type: 'click',
		crossType: 'onclick',
		listener: this.clickCtrl
	});

};

Contact.prototype.getFields = function() {

	// this.fields.name = document.getElementById('cNome');
	// this.fields.mail = document.getElementById('cEmail');
	// this.fields.message = document.getElementById('cMensagem');
	// this.submit = document.getElementById('cSubmit');

	this.fields.name = document.getElementById('cName');
	this.fields.client = document.getElementById('cClient');
	this.fields.cpf = document.getElementById('cCpf');
	this.fields.phone = document.getElementById('cPhone');
	this.fields.email = document.getElementById('cEmail');
	this.fields.address = document.getElementById('cAddress');
	this.fields.city = document.getElementById('cCity');
	this.fields.message = document.getElementById('cMessage');

	this.submit = document.getElementById('cSubmit');

	this.addListeners();

};

Contact.prototype.init = function() {

	this.getFields();

};
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