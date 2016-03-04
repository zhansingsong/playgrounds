/**
 * Vanilla-Share.js
 *
 * @author zhansingsong
 * @email zhansingsong@gmail.com
 * @license MIT
 * 
 */

;(function(w) {
    function Share(options) {
    	var defaults = {
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
    	this.templates = templates;
    	

    }
    Share.prototype = (function(){
    	var _templates = {
            qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}',
            qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}',
            tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
            weibo       : 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}',
            wechat      : 'http://s.jiathis.com/qrcode.php?url={{URL}}',
            douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11',
            diandian    : 'http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link',
            linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin',
            facebook    : 'https://www.facebook.com/sharer/sharer.php?u={{URL}}',
            twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITE_URL}}',
            google      : 'https://plus.google.com/share?url={{URL}}'
        };
    	/**
    	 * _extend——即min-in(混入)模式
    	 * @return 返回合并后对象
    	 */
    	function _extend(){
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
    	}

    	function _getmeta(name) {
    		var _metas = document.getElementsByTagName('meta');
    		for(var _item in _metas){
    			if(_metas[_item].getAttribute('name') === name){
    				return _metas[_item].content;
    			}
    		}
    	}

    	function _getimg(){
    		var _imgs = Array.prototype.slice.apply(document.body.getElementsByTagName('img'),[0]);
    		return encodeURIComponent(_imgs.slice(0, 1)[0].src);
    	}

    	//私有方法
    	function _getSetting(name) {

    	}
    	//prototype
    	return{
    		constructor: Share,
    		getmeta: function(name) {
    			return this._(_getmeta)(name);
    		},
    		extend: function() {
    			return this._(_extend)();
    		},
    		getimg: function() {
    			return this._(_getimg)();
    		}
    		_: function(callback){
    			var _me = this;
    			return function(){
    				return callback.apply(_me, arguments);
    			}
    		},
    	}
    })();


})(window);
