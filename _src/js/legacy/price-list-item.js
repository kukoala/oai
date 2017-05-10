
var PricelistItem = (function() {

	/**
	 * PriceListItem constructor
	 * @param viewport {Element}
	 * @constructor
	 */
	function PricelistItem(viewport) {

		this.viewport = viewport;

	}

	/**
	 * Add 'click' listener to anchor
	 * @param listener {function}
	 */
	PricelistItem.prototype.addListener = function(listener) {

		if (this.viewport.addEventListener)
			this.viewport.addEventListener('click', listener, false);
		else
			this.viewport.attachEvent('onclick', listener);

	};

	return PricelistItem;

})();