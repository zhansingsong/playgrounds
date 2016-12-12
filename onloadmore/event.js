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