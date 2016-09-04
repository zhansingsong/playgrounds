;(function(win, pl) {
		  var meta = {};
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
		  // 增加CSS
		  var _CSSSTR =  '@media (orientation: portrait) { .orientation{font-family:"portrait";} } @media (orientation: landscape) {  .orientation{font-family:"landscape";}}';
		  // automatically load css script
		  function _loadStyleString(css) {
	      var _style = document.createElement('style'),
	          _head = document.getElementsByTagName('head')[0];
	      _style.type = 'text/css';
	      try{
	          _style.appendChild(document.createTextNode(css));
	      } catch (ex) {
	          // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
	          _style.styleSheet.cssText = css;
	      }
	      _head.appendChild(_style);
	      return _style;
		  }

		  var element, timer, cstyle;

		  // createElement
		  function createE(){
		  	// 增加css
		  	_loadStyleString(_CSSSTR);
		  	// 创建新元素
		  	element = document.createElement('i');
		  	element.id = 'orientation';
		  	element.className = 'orientation';
		  	document.body.appendChild(element);
		  }

		  createE();

		  var resizeCB = function(){
		  	cstyle = window.getComputedStyle(element, null);
		  	if(cstyle['font-family'] === 'portrait'){
		  		meta.current = 'portrait';
		  	} else {
		  		meta.current = 'landscape';
		  	}
		  	return function(){
		  		if(cstyle['font-family'] === 'portrait'){
		  			if(meta.current !== 'portrait'){
		  				meta.current = 'portrait';
		  				event.trigger('M');
		  			}
		  		} else {
		  			if(meta.current !== 'landscape'){
		  				meta.current = 'landscape';
		  				event.trigger('M');
		  			}
		  		}
		  	}
		  }

		  var resizeCB1 = function(){
		    if(win.innerWidth > win.innerHeight){
		      meta.current = 'l';
		    } else {
		      meta.current = 'p';
		    }
		    return function(){
		      if(win.innerWidth > win.innerHeight){
		        if(meta.current !== 'l'){
		          meta.current = 'l';
		          event.trigger('M', meta);
		        }
		      } else {
		        if(meta.current !== 'p'){
		          meta.current = 'p';
		          event.trigger('M', meta);
		        }
		      }
		    }
		  }();
		  pl.event = event;
		  win.addEventListener('resize', function(){
		    timer && win.clearTimeout(timer);
		    timer = win.setTimeout(resizeCB, 300);
		  }, false);
		  event.listen('M', function(event){  
		    pl.on && pl.on.call(pl, event); 
		  });
		})(window, window['pl'] || (window['pl'] = {}));