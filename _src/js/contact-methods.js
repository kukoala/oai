
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
