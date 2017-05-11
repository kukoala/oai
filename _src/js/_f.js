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