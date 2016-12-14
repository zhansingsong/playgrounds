/**
 * loadmore event(loadmore事件)
 *
 * @example
 * 注册
 * window.loadmore.on(window, '400', function(){console.log('test')});
 * 注销
 * window.loadmore.off(window, '400');
 */
;
(function(win, loadmore) {
    // 订阅与发布
    function Evt() {
        this.fnlist = {};
    }
    Evt.prototype = function() {
        var listen, trigger, remove, one;
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
            constructor: Evt,
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
        // this.init();
    }
    Loadmore.prototype = function() {
        // 判断是否Window对象
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
        // 绑定事件
        function bindEvent() {
            var me = this;
            var scrollCB = null;

            this.element['__loadmoreObject__'] = this.element['__loadmoreObject__'] || {};
            this.element['__loadmoreObject__']['__loadmoreScrollCB__'] = function(evt) {
                if (!scrollCB) {
                    scrollCB = function() {
                        var target = evt.currentTarget,
                            _isWindow = isWindow(target),
                            _clientHeight = _isWindow ? target.innerHeight : target.clientHeight,
                            _scrollHeight = _isWindow ? document.documentElement.scrollHeight : target.scrollHeight,
                            _triggerHeight = Number(me.type || '200'),
                            _st = _isWindow ? target.pageYOffset : target.scrollTop,
                            _currentHeight = _clientHeight + _st;

                        if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
                            me.event.trigger('__loadmoreEvent__');
                        }
                        return function() {
                            _st = _isWindow ? target.pageYOffset : target.scrollTop;
                            _currentHeight = _clientHeight + _st;
                            if (_scrollHeight > _clientHeight && (_scrollHeight - _currentHeight <= _triggerHeight)) {
                                me.event.trigger('__loadmoreEvent__');
                            }
                        }
                    }();
                } else {
                    scrollCB();
                }
            }
            this.element.addEventListener('scroll', this.element['__loadmoreObject__']['__loadmoreScrollCB__'], false);
            this.event.listen('__loadmoreEvent__', function() {
                me.handler();
            });
        }
        return {
            init: function() {
                bindEvent.call(this);
            },
            destory: function() {
                this.event.remove('__loadmoreEvent__');
                this.element.removeEventListener('scroll', this.element['__loadmoreObject__']['__loadmoreScrollCB__'], false);
                this.event = null;
                this.element = null;
                this.handler = null;
                this.type == void 0;
            }
        }
    }();

    win.loadmore.on = function(element, type, handler) {
        !element['__loadmoreObject__'] && (element['__loadmoreObject__'] = {});
        element['__loadmoreObject__'][type] = new Loadmore(element, type, handler);
        element['__loadmoreObject__'][type].init();
    }
    win.loadmore.off = function(element, type) {
        if (!element['__loadmoreObject__'] && !element['__loadmoreObject__'][type]) {
            return false;
        }
        try {
            element['__loadmoreObject__'][type].destory();
            return (delete element['__loadmoreObject__']);
        } catch (error) {
            throw error;
        }

    }
})(window, window['loadmore'] || (window['loadmore'] = {}));
