(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
	//严格模式
	'use strict';

	/**
	 * Util 工具
	 */
	function Util(){
		var _instance;
		Util = function Util() {
			return _instance;
		};
		Util.prototype = this;
		_instance = new Util();
		_instance.constructor = Util;
		//定义函数
		_instance.getElementTop = function(element) {
		    var _actualTop = element.offsetTop,
		        _current = element.offsetParent;
		    while (_current !== null) {
		        _actualTop += _current.offsetTop;
		        _current = _current.offsetParent;
		    }
		    return _actualTop;
		};
		_instance.handleParameters = function(options) {
				var _str = '';
				for(var key in options){
					_str = _str + key + '=' + encodeURIComponent(options[key]) + '&';
				}
				return _str;
			};
		_instance.extend = function() {
			var _arg,
					_prop,
					_child = {};
			for(_arg = 0; _arg < arguments.length; _arg++) {
				for(_prop in arguments[_arg]){
					if(arguments[_arg].hasOwnProperty(_prop)){
						_child[_prop] = arguments[_arg][_prop];
					}
				}
			}
			return _child;
		};
		_instance.each =  function(o, callback) {
			if(!o){
				return;
			}
			var _r;
			for(var i = 0, l = o.length; i < l; i++){
				_r = callback.call(o[i], i, o[i]);
			}
			return _r;
		};
		_instance.getElementByclassN = function(classNameStr) {
			if(!classNameStr){
				return;
			}
			var _result = [];
			if(document.querySelectorAll){
				_result = document.querySelectorAll(classNameStr);
				if(_result.length > 0){
					return _result;
				}
			}
			var _cnArr = classNameStr.split('.'),
					_prefix = _cnArr[0] || '*',
					_suffix = _cnArr[1],
					_elements = document.body.getElementsByTagName(_prefix),
					_classNames,
					_target;

			_each(_elements, function(index, item){
				if( item.nodeType === 1 ){
					_classNames = item.className.split(/\s+/g);
					_target = item;
					_each(_classNames, function(cindex, citem){
						if((citem + '') === _suffix){
							_result.push(_target);
						}
					});
				}
			});
			return _result;
		};
		_instance.isArray = function(arr) {
			return Object.prototype.toString.call(arr) === '[object Array]';
		};
		_instance.getmeta = function(name) {
			var _metas = document.getElementsByTagName('meta');
			for(var _item in _metas){
				if(_metas[_item].getAttribute('name').toLowerCase() === name){
					return _metas[_item].content;
				}
			}
		};
		_instance.getimg = function(){
			var _imgs = Array.prototype.slice.apply(document.body.getElementsByTagName('img'),[0]);
			return encodeURIComponent(_imgs.slice(0, 1)[0].src);
		};
		_instance.parseUrl = function(name, data){
				var _tplStr = _templates[name];
				_tplStr.replace(/{{([A-Z]*)}}/g, function(match, p1){
					var _key = p1.toLowerCase();
						if(data[_key]){
							return encodeURIComponent(data[_key]);
						}
				});
		};
		_instance.isWeixinBrowser = function(){
		    var ua = navigator.userAgent.toLowerCase();
		    return (/micromessenger/.test(ua)) ? true : false ;
		}


		return _instance;
	};
	/**
	 * WX 微信
	 * @param DOMObject element 微信按钮节点
	 * @param object options 配置项
	 */
	function WX(element, options) {
		    this.container = element;
		    this.wxbox = document.createElement('div');
		    this.util = new Util();
		    this.wxParameters = this.util.handleParameters(options);
		}
		WX.prototype = (function() {
		    return {
		        constructor: WX,
		        init: function() {
		            this.render();
		            this.init = this.show;
		            this.hide();
		        },
		        render: function() {
		            var _upFlag = '',
		                _downFlag = '',
		                _offsetTop = this.util.getElementTop(this.container),
		                _wxParameters = this.wxParameters;
		            // 判断上下
		            if (260 > _offsetTop) {
		                _downFlag = 'display:none;';
		                _upFlag = 'display:block;';
		            } else {
		                _downFlag = 'display:block;';
		                this.wxbox.style.top = '-260px';
		                _upFlag = 'display:none;';
		            }
		            var WXSTR = '\
						        <div style="' + _upFlag + 'position:relative; height: 0;width: 0;border-style: solid;border-width: 16px;border-color: transparent;border-bottom-color: #ddd;top: 2px;"></div>\
						        <div style="width: 200px;text-align: center;background-color: #ddd;box-shadow: 1px 1px 4px #888888;padding: 4px 10px;border-radius: 4px;">\
						          <p class="tt" style="border-bottom: 1px solid #aaa; line-height: 30px;margin:0; margin-bottom:10px;">分享到微信</p>\
						          <img  style="font-size: 12px;line-height: 20px;-webkit-user-select: none;" src="http://s.jiathis.com/qrcode.php?' + _wxParameters + '">\
						          <p style="font-size: 12px;line-height: 20px;">打开微信，点击底部的“发现”，使用 “扫一扫” 即可将网页分享到朋友圈。</p>\
						        </div>\
						        <div style="' + _downFlag + 'height: 0;width: 0;border-style: solid;border-width: 16px;border-color: transparent;border-top-color: #ddd;top: -2px;"></div>';

		            this.wxbox.style.position = 'absolute';
		            this.wxbox.innerHTML = WXSTR;
		            this.container.style.position = 'relative';
		            this.container.style.color = '#000';
		            this.container.appendChild(this.wxbox);
		        },
		        show: function() {
		            this.wxbox.style.display = 'block';
		        },
		        hide: function() {
		            this.wxbox.style.display = 'none';
		        },
		        getflag: function() {
		            return this.wxbox.style.display;
		        }
		    };
		})();

	/**
	 * iShare 分享
	 * @param  Object options 配置项
	 * @return {[type]}         [description]
	 */
	function iShare(options) {
		this.container = this.getElementsByClassN('div.iShare')[0];
		var defaults = {
			title: document.title,
			url: location.href,
			host: location.origin,
			description: this.getmeta('description'),
			image: this.getimg(),
			mobileSites: [],
			sites: ['weibo','qq','wechat','tencent','douban','qzone','linkedin','diandian','facebook','twitter','google'],
			disabled: [],
			initialized: false
		};
		this.defaults = defaults;
		this.settings = this._extend(defaults, options);
		this.templates = templates;
	}
	iShare.prototype = (function(){
		var _templates = {
	        qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary=',
	        qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&summary={{DESCRIPTION}}&desc=&site=',
	        tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
	        weibo       : 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}',
	        wechat      : 'http://s.jiathis.com/qrcode.php?url={{URL}}',
	        douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}',
	        renren			: 'http://widget.renren.com/dialog/share?resourceUrl={{URL}}&title={{TITLE}}&pic={{IMAGE}}&description={{DESCRIPTION}}',
	        youdaonote	: 'http://note.youdao.com/memory/?title={{TITLE}}&pic={{IMAGE}}&summary={{DESCRIPTION}}&url={{URL}}',
	        linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{DESCRIPTION}}&armin=armin',
	        facebook    : 'https://www.facebook.com/sharer/sharer.php?s=100&p[title]={{TITLE}}p[summary]={{DESCRIPTION}}&p[url]={{URL}}&p[images]={{IMAGE}}',
	        twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}',
	        googleplus  : 'https://plus.google.com/share?url={{URL}}&t={{TITLE}}',
	        pinterest		: 'https://www.pinterest.com/pin/create/button/?url={{URL}}&description={{DESCRIPTION}}&media={{IMAGE}}',
	        tumblr			: 'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&url={{URL}}&title={{TITLE}}'
	    };
		/**
		 * _extend——即min-in(混入)模式
		 * @return 返回合并后对象
		 */


		function _isArray(arr){
			return Object.prototype.toString.call(arr) === '[object Array]';
		}

		function _each(o, callback){
			if(!o){
				return;
			}
			var _r;
			for(var i = 0, l = o.length; i < l; i++){
				_r = callback.call(o[i], i, o[i]);
			}
			return _r;
		}

		function _getElementByclassN(classNameStr){
			if(!classNameStr){
				return;
			}
			var _result = [];
			if(document.querySelectorAll){
				_result = document.querySelectorAll(classNameStr);
				if(_result.length > 0){
					return _result;
				}
			}
			var _cnArr = classNameStr.split('.'),
					_prefix = _cnArr[0] || '*',
					_suffix = _cnArr[1],
					_elements = document.body.getElementsByTagName(_prefix),
					_classNames,
					_target;

			_each(_elements, function(index, item){
				if( item.nodeType === 1 ){
					_classNames = item.className.split(/\s+/g);
					_target = item;
					_each(_classNames, function(cindex, citem){
						if((citem + '') === _suffix){
							_result.push(_target);
						}
					});
				}
			});
			return _result;
		}


		function _getmeta(name){
			var _metas = document.getElementsByTagName('meta');
			for(var _item in _metas){
				if(_metas[_item].getAttribute('name').toLowerCase() === name){
					return _metas[_item].content;
				}
			}
		}


		function _getimg(){
			var _imgs = Array.prototype.slice.apply(document.body.getElementsByTagName('img'),[0]);
			return encodeURIComponent(_imgs.slice(0, 1)[0].src);
		}


		function _parseUrl(name, data){
				var _tplStr = _templates[name];
				_tplStr.replace(/{{([A-Z]*)}}/g, function(match, p1){
					var _key = p1.toLowerCase();
						if(data[_key]){
							return encodeURIComponent(data[_key]);
						}
				});
		}

		function _isWeixinBrowser(){
		    var ua = navigator.userAgent.toLowerCase();
		    return (/micromessenger/.test(ua)) ? true : false ;
		}


		//私有方法
		function _getSetting(name) {

		}
		//prototype
		return{
			constructor: Share,
			init: function() {

			},
			render: function() {

			},
			bindEvent: function() {

			}
			destory: function() {

			}
			getmeta: function(name) {
				return this._(_getmeta)(name);
			},
			extend: function() {
				return this._(_extend)();
			},
			getimg: function() {
				return this._(_getimg)();
			},
			getElementsByClassN: function() {
				return this._(_getElementByclassN)();
			},
			_: function(callback){
				var _me = this;
				return function(){
					return callback.apply(_me, arguments);
				}
			},
		}
	})();
	return iShare;
});