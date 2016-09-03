/**
 * iShare.js
 * @author singsong
 * @email	zhansingsong@gmail.com
 * @date 2016.3.6
 */
;
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.iShare = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
	/**
	 * 严格模式
	 */
	'use strict';
	
	/**
	 * Util 单例工具类
	 */
	var Util = {
			/**
			 * trim 		
			 * @param  {String} str 字符串
			 * @return {String}    
			 */
			trim: function(str){
				if(String.prototype.trim){
					return str.trim();
				}
				return str.replace(/^\s+|s+$/g, '');
			},

			/**
			 * keys 获取对象keys
			 * @param  {Object} o 对象
			 * @return {Array}   
			 */
			keys: function(o){
				if(o !== Object(o)){
					throw new TypeError('o is non-object');
				}
				if(Object.keys){
					return Object.keys(o);
				}
				var _keys = [], _k;
				for(_k in o){
					if(Object.prototype.hasOwnProperty.call(o, _k)){
						_keys.push(_k);
					}
				}
				return _keys;
			},

			/**
			 * indexOf 
			 * @param  {Array} 	arr  数组
			 * @param  {Object} item 项
			 * @return {Number}      索引
			 */
			indexOf: function(arr, item){
				if(!this.isArray(arr)){
					 throw new Error(arr.toString() + ' is a non-Array！');
				}
				if(Array.prototype.indexOf){
					return arr.indexOf(item);
				}
				for(var i = 0, len = arr.length; i < len; i++){
					if(arr[i] === item){
						return i;
					}
				}
			},

			/**
			 * isArray 判断是否是数组
			 * @param  {Ojbect}  arr 被判断对象
			 * @return {Boolean}     
			 */
			isArray: function(arr) {
				if(Array.isArray){
					return Array.isArray(arr);
				}
				return Object.prototype.toString.call(arr) === '[object Array]';
			},

			/**
			 * validate 验证用户输入的有效性
			 * @param  {Object} ref 参考对象
			 * @param  {Object} o   验证对象
			 * @return {Array}     	错误队列
			 */
			validate: function(ref, o){
				var _key, 
						_result = [];

				if(this.isArray(o)){
					for(var i = 0, item; item = o[i++];){
						if(this.indexOf(ref, item) < 0){
							_result.push(item);
						}
					}
				} else {
					for(_key in o){
						if(!(_key in ref)){
							_result.push(_key);
						}
					}
				}
				if(_result.length !== 0){
					throw new Error('there is such no property: ' + _result.join(', '));
				}
			},

			/**
			 * getElementTop 获取元素的offsetTop
			 * @param  {DOMObject} element 元素
			 * @return {Number}    offsetTop值
			 */
			getElementTop: function(element) {
			    var _actualTop = element.offsetTop,
			        _current = element.offsetParent;
			    while (_current !== null) {
			        _actualTop += _current.offsetTop;
			        _current = _current.offsetParent;
			    }
			    return _actualTop;
			},

			/**
			 * handleParameters 处理URL参数
			 * @param  {Object} options 配置项
			 * @return {String}  
			 */
			handleParameters: function(options) {
					var _str = '';
					for(var key in options){
						_str = _str + key + '=' + encodeURIComponent(options[key]) + '&';
					}
					return _str;
				},

			/**
			 * extend mix-in
			 * @return {Ojbect} 
			 */
			extend: function() {
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
			},

			/**
			 * each 遍历数组
			 * @param  {Array}   	o       		数组
			 * @param  {Function} callback		回调函数
			 * @return {Object}
			 */
			each:  function(o, callback) {
				if(!o){
					return;
				}
				var _r;
				for(var i = 0, l = o.length; i < l; i++){
					_r = callback.call(o[i], i, o[i]);
				}
				return _r;
			},

			/**
			 * getElementByclassN 通过class获取元素
			 * @param  {String} classNameStr 类名
			 * @return {DOMObject}
			 *
			 * @example
			 * getElementByclassN('.test');
			 */
			getElementByclassN: function(classNameStr) {
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

				this.each(_elements, function(index, item){
					if( item.nodeType === 1 ){
						_classNames = item.className.split(/\s+/g);
						_target = item;
						this.each(_classNames, function(cindex, citem){
							if((citem + '') === _suffix){
								_result.push(_target);
							}
						});
					}
				});
				return _result;
			},

			/**
			 * getmeta 通过name获取对应meta的content值
			 * @param  {String} name meta的name
			 * @return {String}
			 */
			getmeta: function(name) {
				var _metas = document.getElementsByTagName('meta');
				for(var i = 0, _item; _item = _metas[i++];){
					if(_item.getAttribute('name').toLowerCase() === name){
						return _item.content;
					}
				}
			},

			/**
			 * getimg 获取页面中第一张图片的URL
			 * @return {String}
			 */
			getimg: function(){
				var _imgs = this.convertToArray(document.body.getElementsByTagName('img'));
				if(_imgs.length === 0){
					return;
				}
				return encodeURIComponent(_imgs[0].src);
			},

			/**
			 * parseUrl 解析URL
			 * @param  {Object}	tpl  模板
			 * @param  {Object} data 数据 
			 * @return {Object}
			 */
			parseUrl: function(tpl, data){
					var _tplStr = {};
					for(var _name in tpl){
							_tplStr[_name] = tpl[_name].replace(/{{([A-Z]*)}}/g, function(match, p1){
								var _key = p1.toLowerCase();
									if(data[_key]){
										return encodeURIComponent(data[_key]);
									} else {
										return '';
									}
							});
					}
					return _tplStr;
			},

			/**
			 * isWeixinBrowser 判断是否在微信中
			 * @return {Boolean}
			 */
			isWeixinBrowser: function(){
			    var _ua = navigator.userAgent.toLowerCase();
			    return (/micromessenger/.test(_ua)) ? true : false ;
			},
			/**
			 * getSingle 获取单例
			 */
			getSingle: function(o){
				var _result;
				return function(){
					if(_result){
						_result = (typeof o === 'function') ? o.apply(null, arguments) : o;
					}
					return _result;
				}
			},

			/**
			 * convertToArray 转换为数组
			 * @param  {NodeList} nodes Nodes数组
			 * @return {Array}      
			 */
			convertToArray: function(nodes){
				var _array = null;
				try {
					_array = Array.prototype.slice.call(nodes, 0);
				} catch (ex){
					// 针对IE8及之前版本
					_array = new Array();
					for(var i = 0, len = nodes.length; i < len; i++) {
						 _array.push(nodes[i]);
					}
				}
				return _array;
			},

			/**
			 * parseClassName 解析类名
			 * @param  {String} className 类名
			 * @param  {Object} tpl       模板数据
			 * @return {String}           
			 */
			parseClassName: function(className, tpl){
			var _result = null;
			var _arr = className.split(/\s+/);
			for(var i = 0, item; item = _arr[i++];){
					if(item in tpl){
						 return tpl[item];
					}
				}
			},

			/**
			 * getDimension 获取可视页面的尺寸
			 * @return {Object} 
			 */
			getDimension: function(){
				var _pageWidth = window.innerWidth,
						_pageHeight = window.innerHeight;
				if(typeof _pageWidth !== 'number'){
					if(document.compatMode === 'CSS1Compat'){
						_pageWidth = document.documentElement.clientWidth;
						_pageHeight = document.documentElement.clientHeight;
					} else {
						_pageWidth = document.body.clientWidth;
						_pageHeight = document.body.clientHeight;
					}
				}
				return {pageWidth: _pageWidth, pageHeight: _pageHeight};
			},
			/**
			 * getElementDimension 获取某个元素的尺寸
			 * @param  {Node}		element 	元素对象
			 * @return {Object}         	对象尺寸
			 */
			getElementDimension: function(element){
				var _height = element.offsetHeight,
						_width = element.offsetWidth;
				return {
					width: _width,
					height: _height
				}
			},
		};

		/**
		 * WX 微信类
		 * @param {DOMObject} element 微信按钮节点
		 * @param {object} 		options 配置项
		 */
		function WX(pcontainer, element, URL) {
			    this.container = element;
			    this.wxbox = document.createElement('div');
			    this.wxURL = URL;
			    this.init();
			}
		WX.prototype = (function() {
		    return {
		        constructor: WX,
		        init: function() {
		            this.render();
		            this.init = this.show;
		            this.bindEvent();
		            this.hide();
		        },
		        render: function() {
		            var _upFlag = '',
		                _downFlag = '',
		           		  _offsetTop = Util.getElementTop(this.container),
		           		  _containerSize = Util.getElementDimension(this.container),
		                _wxURL = this.wxURL,
		                _top = 0,
		                _left = 0;

		            // 判断上下
		            if (Util.getDimension().pageHeight / 2 <= _offsetTop) {
		                _downFlag = 'display:none;';
		                _upFlag = 'display:block;';
		                _top = '-5px;';
		            } else {
		                _downFlag = 'display:block;';
		                _upFlag = 'display:none;';
		                _top = '244px;';
		            }
		            _left = (_containerSize.width / 2 - 6) + 'px';
		            var WXSTR = '\
						        <div style="' + _upFlag + 'position:relative; height: 0;width: 0;border-style: solid;border-width: 12px;border-color: transparent;border-bottom-color: #ddd;top: 2px;"></div>\
						        <div style="width: 150px;text-align: center;background-color: #ddd;box-shadow: 1px 1px 4px #888888;padding: 4px 10px;border-radius: 4px;">\
						          <p class="tt" style="border-bottom: 1px solid #aaa; line-height: 30px;margin:0; margin-bottom:10px;">分享到微信</p>\
						          <img  style="font-size: 12px;line-height: 20px;-webkit-user-select: none;" src="' + _wxURL + '">\
						          <p style="font-size: 12px;line-height: 20px;">打开微信，使用 “扫一扫” 即可将网页分享到朋友圈。</p>\
						        </div>\
						        <div style="' + _downFlag + 'height: 0;width: 0;border-style: solid;border-width: 12px;border-color: transparent;border-top-color: #ddd;top: -2px;"></div>';
		            
		            this.wxbox.innerHTML = WXSTR;

		            this.container.style.position = 'relative';
		            this.container.style.color = '#000';
		            this.container.appendChild(this.wxbox);
		            this.wxbox.style.position = 'absolute';
		            this.wxbox.style.left = _left;
		            this.wxbox.style.top = _top;
		        },
		        bindEvent: function(){
	            var _me = this;
	            this.container.onmouseout = function(){
	            	_me.hide();
	            }
	            this.container.onmouseover = function(){
	            	_me.show();
	            }
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
	 * @param  {Object} options 配置项
	 * @return 
	 */
	function iShare() {
		this.container = Util.getElementByclassN('div.iShare')[0];
		var defaults = {
			title: document.title,
			url: location.href,
			host: location.origin || '',
			description: Util.getmeta('description'),
			image: Util.getimg(),
			sites: ['iShare_weibo','iShare_qq','iShare_wechat','iShare_tencent','iShare_douban','iShare_qzone','iShare_renren','iShare_youdaonote','iShare_facebook','iShare_linkedin','iShare_twitter','iShare_googleplus','iShare_tumblr','iShare_pinterest'],
			initialized: true,
			isTitle: false,
			isAbroad: false
		},
		dataSites = this.container.getAttribute('data-sites'),
		dataSitesArr =  dataSites ? dataSites.split(/\s*,\s*/g) : [];

		/* 验证用户输入的有效性 */
		Util.validate(defaults.sites, dataSitesArr),
		Util.validate(defaults, iShare_config),
		Util.validate(defaults.sites, iShare_config.sites);

		/* 保存defaults */
		this.defaults = defaults;
		this.dataSites = dataSites ? {sites: dataSitesArr} : {};
		this.config = iShare_config;


		/* 验证是否在微信中 */
		if(Util.isWeixinBrowser()){
			this.defaults.splice(this.defaults.indexOf('iShare_wechat'), 1);
			this.dataSites.splice(this.dataSites.indexOf('iShare_wechat'), 1);
			this.config.splice(this.config.indexOf('iShare_wechat'), 1);
		}

		this.settings = Util.extend(defaults,((!this.config.isAbroad) ? {sites: defaults.sites.slice(0,8)} : defaults), this.config, this.dataSites);
		this.init();
	}
	iShare.prototype = (function(){
		var _templates = {
	        iShare_qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary=&pics={{IMAGE}}',
	        iShare_qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&summary={{DESCRIPTION}}&pics={{IMAGE}}&desc=&site=',
	        iShare_tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
	        iShare_weibo       : 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}',
	        iShare_wechat      : 'http://s.jiathis.com/qrcode.php?url={{URL}}',
	        iShare_douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}',
	        iShare_renren			 : 'http://widget.renren.com/dialog/share?resourceUrl={{URL}}&title={{TITLE}}&pic={{IMAGE}}&description={{DESCRIPTION}}',
	        iShare_youdaonote  : 'http://note.youdao.com/memory/?title={{TITLE}}&pic={{IMAGE}}&summary={{DESCRIPTION}}&url={{URL}}',
	        iShare_linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{DESCRIPTION}}&armin=armin',
	        iShare_facebook    : 'https://www.facebook.com/sharer/sharer.php?s=100&p[title]={{TITLE}}p[summary]={{DESCRIPTION}}&p[url]={{URL}}&p[images]={{IMAGE}}',
	        iShare_twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}',
	        iShare_googleplus  : 'https://plus.google.com/share?url={{URL}}&t={{TITLE}}',
	        iShare_pinterest	 : 'https://www.pinterest.com/pin/create/button/?url={{URL}}&description={{DESCRIPTION}}&media={{IMAGE}}',
	        iShare_tumblr			 : 'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&url={{URL}}&title={{TITLE}}'
	    },
  			_names = {
          iShare_qq          : 'QQ好友',
          iShare_qzone       : 'QQ空间',
          iShare_tencent     : '腾讯微博',
          iShare_weibo       : '新浪微博',
          iShare_wechat      : '微信',
          iShare_douban      : '豆瓣',
          iShare_renren			 : '人人',
          iShare_youdaonote  : '有道笔记',
          iShare_linkedin    : 'Linkedin',
          iShare_facebook    : 'Facebook',
          iShare_twitter     : 'Twitter',
          iShare_googleplus  : 'Google+',
          iShare_pinterest	 : 'Pinterest',
          iShare_tumblr			 : 'Tumblr'
      }
    /**
     * _updateUrl 更新添加分享的A标签
     */
		function _updateUrl(){
			if(!this.container.hasChildNodes()){
				return;
			}
			var _children = this.container.childNodes,
					_tempURL;
			for(var i = 0, item; item = _children[i++];){
				if(item.nodeType === 1){
					_tempURL = Util.parseClassName(item.className, Util.parseUrl(_templates, this.settings));
					if(_tempURL){
						if((item.className).indexOf('iShare_wechat') > -1){
							(new WX(this.container, item, _tempURL));
						} else {
							item.href = _tempURL;
							item.target = '_blank';
						}
					}
				}
			}
		}
		//prototype
		return{
			constructor: iShare,
			init: function() {
				if(this.settings.initialized){
					_autoUpdate.call(this);
				} else {
					_updateUrl.call(this);
				}
			}
		}
	})();
	return (new iShare());
});