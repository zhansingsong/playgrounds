/**
 * loadmore :　loadmore event detection
 * loadmore事件
 */
;
(function(win, loadmore) {
    // 订阅与发布
    function Evt() {
        this.fnlist = {};
    }
    Evt.prototype = function() {
        var listen,
            trigger,
            remove,
            one;
        var shift = Array.prototype.shift;

        listen = function(type, fn, one) {
            fn['__one__'] = one;
            fn['__called__'] = false;
            (this.fnlist[type] || (this.fnlist[type] = [])).push(fn);
            return fn;
        };

        trigger = function(type) {
            var key = shift.call(arguments),
                fns = this.fnlist[key];
            if (!fns || fns.length === 0) {
                return false;
            }
            for (var i = 0, fn; fn = fns[i++];) {
                if (!fn['__called__']) {
                    fn.apply(this, arguments);
                }
                if (fn['__one__']) {
                    fn['__called__'] = true;
                }
            }
        };
        remove = function(type, fn) {
            var fns = this.fnlist[type];
            if (!fns) {
                return false;
            }
            if (!fn) {
                fns && (fns.length = 0);
            } else {
                for (var j = 0, l = fns.length; j < l; j--) {
                    if (fn === fns[j]) {
                        fns.splice(j, 1);
                    }
                }
            }
        };
        one = function(type, fn) {
            listen(type, fn, true);
        }
        return {
            listen: listen,
            trigger: trigger,
            remove: remove,
            one: one
        }
    }();

    // loadmore
    function Loadmore(element, type, handler) {
        this.element = element;
        this.type = type;
        this.handler = handler;
        this.event = new Evt();
        this.scrollCB = null;
        this.init();
    }
    Loadmore.prototype = function() {
        function isWindow(o) {
            var winString = {
                "[object Window]": 1,
                "[object DOMWindow]": 1,
                "[object global]": 1
            };
            var toString = Object.prototype.toString;
            if (!o || typeof o !== "object") {
                return false;
            }
            return !!winString[toString.call(o)];
        }
        function callback(evt){
        	// scrollCB.call(me, event);
        	if (!me.scrollCB) {
        	    me.scrollCB = function() {
        	        var target = evt.currentTarget,
        	            _isWindow = isWindow(target),
        	            _clientHeight = _isWindow ? target.innerHeight : target.clientHeight,
        	            _scrollHeight = _isWindow ? document.documentElement.scrollHeight : target.scrollHeight,
        	            _triggerHeight = Number(this.type || '200'),
        	            _st = _isWindow ? target.pageYOffset : target.scrollTop,
        	            _currentHeight = _clientHeight + _st;

        	        if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
        	            this.event.trigger('__loadmore__');
        	        }
        	        return function() {
        	            _st = _isWindow ? target.pageYOffset : target.scrollTop;
        	            _currentHeight = _clientHeight + _st;
        	            console.log(target.toString() + ': ' + '_scrollHeight=' + _scrollHeight + ' , _clientHeight=' + _clientHeight + ', _currentHeight=' + _currentHeight + ', _triggerHeight=' + _triggerHeight);
        	            if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
        	                this.event.trigger('__loadmore__');
        	            }
        	            console.log('inner');
        	        }
        	    }();
        	} else {
        	    me.scrollCB();
        	}
        }
        function bindEvent() {
            var me = this;
            var callback = 
            this.element.addEventListener('scroll', callback.bind(me), false);
            this.event.listen('__loadmore__', function() {
                me.handler.call(me);
            });
        }
        return {
            init: function() {
                bindEvent.call(this);
            },
            destory: function() {
                this.event.remove('__loadmore__');
                this.element.removeEventListener('scroll', scrollCB);
                this.event = null;
                this.element = null;
                this.handler = null;
                this.type == void 0;
            }
        }
    }();


    win.loadmore.on = function(element, type, handler) {
    	!element.loadmore && (element.loadmore = {});
    	element.loadmore[type] =  new Loadmore(element, type, handler);
    	element.loadmore[type].init();
    }
    win.loadmore.off = function(element, type){
			if(!element.loadmore && !element.loadmore[type]){
				return false;
			}	
			element.loadmore[type].destory();
			delete element.loadmore;
    }
})(window, window['loadmore'] || (window['loadmore'] = {}));
