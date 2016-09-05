;(function(win, pl) {
		  var meta = {},
		  		cbs = [],
		  		element,
		  		timer,
		  		cstyle;

		  var head = document.head ? document.head : document.getElementsByTagName('head')[0];
		  // 增加CSS
		  var _CSSSTR =  '@media (orientation: portrait) { .orientation{font-family:"portrait";} } @media (orientation: landscape) {  .orientation{font-family:"landscape";}}';
		  // 订阅与发布
		  var event = function(){
		    var fnlist = {},
		        listen,
		        trigger,
		        remove;
		    listen = function(e, fn){
		      if(!fnlist[e]){
		        fnlist[e] = [];
		      }
		      fnlist[e].push(fn);
		    };
		    trigger = function(e){
		      var key = [].shift.call(arguments),
		          fns = fnlist[key];
		      if(!fns || fns.length === 0){
		        return false;
		      }
		      for(var i = 0, fn; fn = fns[i++];){
		        fn.apply(this, arguments);
		      }
		    };
		    remove = function(e, fn){
		      var fns = fnlist[e];
		      if(!fns){
		        return false;
		      }
		      if(!fn){
		        fns && (fns.length = 0);
		      } else {
		        for(var j = 0, l = fns.length; j < l; j--){
		          if(fn === fns[j]){
		            fns.splice(j, 1);
		          }
		        }
		      }
		    }
		    return{
		      listen: listen,
		      trigger: trigger,
		      remove: remove
		    }
		  }();

		  // automatically load css script
		  function _loadStyleString(css) {
	      var _style = document.createElement('style');
	      _style.type = 'text/css';
	      try{
	          _style.appendChild(document.createTextNode(css));
	      } catch (ex) {
	          // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
	          _style.styleSheet.cssText = css;
	      }
	      head.appendChild(_style);
	      return _style;
		  }
		  // init orientation
		  function initOrientation(){
		  	var html = document.documentElement,
		  			hstyle = window.getComputedStyle(html, null),
		  			cssstr = '@media (orientation: portrait) { .orientationinit{font-family:"portrait" ' + hstyle['font-family'] + ';} } @media (orientationinit: landscape) {  .orientation{font-family:"landscape" ' + hstyle['font-family'] + ';}}';
		  	_loadStyleString(orientationinit);

		  	html.className = 'orientationinit' + html.className;
		  	console.log(hstyle['font-family']);
		  }
			initOrientation();
		  // callback
		  var resizeCB = function(){
		  	cstyle = window.getComputedStyle(head, null);
		  	if(win.innerWidth > win.innerHeight){//初始化判断(@media需要)
		  		meta.init = 'landscape';
		  	  meta.current = 'landscape';
		  	} else {
		  		meta.init = 'portrait';
		  	  meta.current = 'portrait';
		  	}
		  	return function(){
		  		if(cstyle['font-family'] === 'portrait'){
		  			if(meta.current !== 'portrait'){
		  				meta.current = 'portrait';
		  				event.trigger('__orientationChange__', meta);
		  			}
		  		} else {
		  			if(meta.current !== 'landscape'){
		  				meta.current = 'landscape';
		  				event.trigger('__orientationChange__', meta);
		  			}
		  		}
		  	}
		  }();
		  // 监听
		  win.addEventListener('resize', function(){
		    timer && win.clearTimeout(timer);
		    timer = win.setTimeout(resizeCB, 300);
		  }, false);

		  event.listen('__orientationChange__', function(event){
		  	if(cbs.length === 0){
		  		return false;
		  	}
		  	for(var i = 0, cb; cb = cbs[i++];){
		  		if(typeof cb === 'function'){
		  			cb.call(pl, event);
		  		} else {
		  			throw new Error('The accepted argument must be a function.');
		  		}
		  	}
		  });
		  // init
		  (function(){
		  	_loadStyleString(_CSSSTR);
		  	head.className = 'orientation' + head.className;
		  })();
		  // 接口
		  pl.orientation = meta;
		  pl.event = event;
		  pl.on = function(cb){
		  	cbs.push(cb);
		  }
		})(window, window['pl'] || (window['pl'] = {}));