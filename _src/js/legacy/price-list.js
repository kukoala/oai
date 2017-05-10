
var Pricelist = (function() {

	/**
	 * PriceList constructor
	 * @param viewport {Element}
	 * @constructor
	 */
	function Pricelist(viewport) {

		this.viewport = viewport;

		this.pricelistItem = [];

		this.pricelistItemElements = this.viewport.querySelectorAll('.PricelistItem');

		this.itemOnClick = function() {

//				console.log('do something');

		};

		if (this.pricelistItemElements.length)
			this.init();

	}

	/**
	 * Init the PricelistItem instances
	 */
	Pricelist.prototype.init = function() {

		for (var i = this.pricelistItemElements.length; i--; ) {

			var item = new PricelistItem(this.pricelistItemElements[i]);
			item.addListener(this.itemOnClick);

			this.pricelistItem.push(item);

		}

	};

	return Pricelist;

})();