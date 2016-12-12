/**
 * loadmore :　loadmore event detection
 * loadmore事件
 */
;
(function(win) {
    var meta = {},
        cbs = [],
        timer;
    // 订阅与发布
    var event = function() {
        var fnlist = {},
            listen,
            trigger,
            remove,
            one;
        var shift = Array.prototype.shift;

        listen = function(type, fn, one) {
            fn['__one__'] = one;
            fn['__called__'] = false;
            (fnlist[type] || (fnlist[type] = [])).push(fn);
            return fn;
        };

        trigger = function(type) {
            var key = shift.call(arguments),
                fns = fnlist[key];
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
            var fns = fnlist[type];
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
        this.init();
    }
    Loadmore.prototype.init = function() {

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
        var me = this;
        var scrollCB = function(evt) {
            var target = evt.currentTarget,
                _isWindow = isWindow(target),
                _clientHeight = _isWindow ? target.innerHeight : target.clientHeight,
                _scrollHeight = _isWindow ? document.documentElement.scrollHeight : target.scrollHeight,
                _triggerHeight = Number(me.type || '200'),
                _st = _isWindow ? target.pageYOffset : target.scrollTop,
                _currentHeight = _clientHeight + _st;

            if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
                event.trigger('__loadmore__');
            }
            console.log('outer');
            scrollCB = function(evt) {
                _currentHeight = _clientHeight + target.scrollTop;
                if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
                    event.trigger('__loadmore__');
                }
                console.log('inner');
            }
        }

        function bindEvent() {
            this.element.addEventListener('scroll', scrollCB, false);
            event.listen('__loadmore__', function() {
                handler.call(me);
            });
        }
        return function() {
            bindEvent.call(this);
        }
    }();


    win.loadmore = function(element, type, handler) {
        (new Loadmore(element, type, handler));
    }

})(window);
