
var PricelistContent = (function() {

	/**
	 * PriceListContent constructor
	 * @param viewport {Element}
	 * @constructor
	 */
	function PricelistContent(viewport) {

		this.viewport = viewport;

		if (this.viewport)
			this.pricelistElements = this.viewport.querySelectorAll('.Pricelist');

		this.pricelist = [];

		for (var i = this.pricelistElements.length; i--; )
			this.pricelist.push(new Pricelist(this.pricelistElements[i]));

	}

	return PricelistContent;

})();