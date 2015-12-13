/**
 * author jQuery plugin template
 * @param  {[type]} $         [description]
 * @param  {[type]} window    [description]
 * @param  {[type]} document  [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
;(function ($, window, document, undefined) {
	var pluginName = 'navTab',
		defaults = {

		};
	//define constructor
	var Tab = function (element, options) {
		this.element = element;
		this._defaults = defaults;
		this._name = pluginName;
		this.version = '1.0.0';
		this.settings = $.extend({}, defaults, options);
		this.init();
	}
	Tab.prototype = function() {
		init: function () {
			// to do something....
		},
		constructor: Tab
	};
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if(!$.data(this, 'plugin_' + pluginName)) {
				// the first parameter is a DOM object
				$.data(this, 'plugin_' + pluginName, new Tab(this, options));
			}
		});
		// support jQuery chainable syntax
		// return this;
	};
})(jQuery, window, document);