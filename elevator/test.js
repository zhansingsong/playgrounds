(function(b) {
    if (typeof Array.prototype.indexOf !== "function") {
        Array.prototype.indexOf = function(e) {
            for (var d = this.length - 1; d >= 0; d--) {
                if (this[d] === e) {
                    return d
                }
            }
        }
    }
    function c(e) {
        var d = document.createElement("b");
        d.innerHTML = "<!--[if IE " + e + "]><i></i><![endif]-->";
        return d.getElementsByTagName("i").length === 1
    }
    function a(d, e) {
        this.element = b(e);
        this.namespace = "iElevator";
        var g = {
            floors: null ,
            btns: null ,
            backtop: null ,
            selected: "",
            sticky: -1,
            visible: {
                isHide: "no",
                numShow: 0
            },
            speed: 400,
            show: function(h) {
                h.element.show()
            },
            hide: function(h) {
                h.element.hide()
            }
        }
          , f = this.element.data("ielevator-options") || {};
        this.settings = b.extend({}, g, d, f);
        this.init(d)
    }
    a.prototype = (function() {
        var i = [], l, h;
        var m = function(y) {
            var x = q.call(this, "visible")
              , w = x.isHide.toLowerCase()
              , z = x.numShow;
            if (w === "yes") {
                this.element.hide();
                this.numShow = z
            } else {
                z = 0
            }
            m = function(A) {
                if (A >= z) {
                    f.call(this)
                } else {
                    o.call(this)
                }
            }
        }
          , s = (function() {
            if (c(6)) {
                b("html").css({
                    backgroundImage: "url(about:blank)",
                    backgroundAttachment: "fixed"
                });
                return function(x, w) {
                    if (this.element[0].currentStyle.position === "fixed") {
                        this.element.css("position", "absolute")
                    }
                    this.element.css("top", parseInt(x, 10) + w + "px");
                    s = function(z, y) {
                        this.element.css("top", parseInt(z, 10) + y + "px")
                    }
                }
            }
        })();
        function k(w) {
            var x = {
                floors: ("floors"in w),
                btns: ("btns"in w),
                backtop: ("backtop"in w)
            };
            if (x.floors) {
                this.floors = q.call(this, "floors");
                this.floors.each(function() {
                    i.push(b(this).offset().top | 0)
                });
                this.btns = x.btns ? q.call(this, "btns") : null
            }
            if (x.backtop) {
                this.backtop = q.call(this, "backtop")
            }
            if (this.btns) {
                if (this.backtop) {
                    h = this.btns.add(this.backtop)
                } else {
                    h = this.btns
                }
            } else {
                h = this.backtop
            }
            l = i.slice();
            l.push(0);
            if (!(x.floors && x.btns && x.backtop) && !(x.floors && x.btns) && !(x.backtop)) {
                b.error('you provide at least one of "cBacktop" , "cFloors + cBtns" or "cFloors + cBtns + cBacktop"')
            }
        }
        function g(z) {
            var w = document.createElement("style")
              , x = document.getElementsByTagName("head")[0];
            w.type = "text/css";
            try {
                w.appendChild(document.createTextNode(z))
            } catch (y) {
                w.styleSheet.cssText = z
            }
            x.appendChild(w);
            return w
        }
        var d = function(z) {
            var w = +q.call(this, "sticky")
              , y = this.element.offset().top
              , x = ".fixed{position: fixed; top: " + w + "px;}";
            if (w < 0) {
                return
            }
            g(x);
            if (z - w > y) {
                this.element.addClass("fixed")
            } else {
                this.element.removeClass("fixed")
            }
            d = function(A) {
                if (A + w > y) {
                    this.element.addClass("fixed")
                } else {
                    this.element.removeClass("fixed")
                }
            }
        }
        ;
        function q(x) {
            if (x in this.settings) {
                var w = this.settings[x]
                  , y = {
                    cFloors: true,
                    cBtns: true,
                    cBacktop: true
                };
                if (!w && y[x]) {
                    b.error('the "' + x + '" is required, not ' + w)
                } else {
                    return w
                }
            } else {
                b.error('the settings contains no such "' + x + '"option!')
            }
        }
        function f() {
            q.call(this, "show")(this)
        }
        function o() {
            q.call(this, "hide")(this)
        }
        function t(w) {
            var x = parseInt(w, 10)
              , y = i.indexOf(x);
            if (y > -1) {
                return y
            }
            i.push(x);
            i.sort(function(z, C) {
                return z - C
            });
            y = i.indexOf(x);
            i.splice(y, 1);
            return ( y - 1)
        }
        function e(x, w) {
            if (x === -1) {
                return
            }
            b("html, body").animate({
                scrollTop: l[x]
            }, w)
        }
        function u(w) {
            if (w < 0) {
                return
            }
            var x = q.call(this, "selected");
            h && h.removeClass(x).eq(w).addClass(x)
        }
        function p(y) {
            var w = q.call(this, "selected"), A, x;
            if (!w) {
                return
            }
            typeof w === "string" ? A = w : x = w;
            A && h && h.removeClass(A).eq(y).addClass(A);
            if (x) {
                var B = h.eq(y).position().top
                  , z = h.eq(y).height();
                if (y < 0) {
                    return
                }
                x.css({
                    top: B + "px",
                    height: z + "px"
                })
            }
        }
        function v() {
            var w = this
              , y = q.call(this, "speed")
              , x = l.length;
            h.on("click." + this.namespace, function(z) {
                var A = h.index(b(this));
                e.call(w, A, y)
            });
            b(window).on("scroll." + this.namespace, function() {
                var A = b(this).scrollTop();
                var z = t.call(w, A);
                s && s.call(w, A, w.numShow);
                m.call(w, A);
                p.call(w, z);
                d.call(w, A)
            })
        }
        function n() {
            this.element.off("." + this.namespace);
            b(window).off("." + this.namespace)
        }
        function r() {
            n.call(this);
            b.removeData(this)
        }
        function j(w) {
            k.call(this, w);
            m.call(this);
            v.call(this)
        }
        return {
            constructor: a,
            init: function(w) {
                this._(j)(w)
            },
            destory: function() {
                console.log("destory");
                this._(r)()
            },
            getSettings: function(w) {
                return this._(q)(w)
            },
            _: function(x) {
                var w = this;
                return function() {
                    return x.apply(w, arguments)
                }
            }
        }
    })();
    b.fn.ielevator = function(e) {
        var g = "ielevatorPlugin", d, f;
        if (typeof e === "string") {
            d = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var h = b.data(this, g);
                if (!h) {
                    b.error("The plugin has not been initialised yet when you tried to call this method: " + e);
                    return
                }
                if (!b.isFunction(h[e])) {
                    b.error("The plugin contains no such method: " + e);
                    return
                } else {
                    f = h[e].apply(h, d)
                }
            });
            if (f !== undefined) {
                return f
            } else {
                return this
            }
        } else {
            return this.each(function() {
                var h = b.data(this, g);
                if (h) {
                    h(e)
                } else {
                    b.data(this, g, new a(e,this))
                }
            })
        }
    }
})(jQuery);
