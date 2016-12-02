/**
 * customEvents
 * 
 * @description 
 * customEvents is a cross-browser custom evetns library in vanilla javascript without any frameworks
 * 
 * @method 
 * fireEvent
 * addEvent
 * removeEvent
 * 
 * @example
 * customEvents.addEvent(window.document.body, 'test', function(e){alert('test')});	
 * customEvents.fireEvent(window.document.body, 'test');
 * 
 */

var customEvents = function() {
    var fireEvent,
        addEvent,
        removeEvent;
    // 针对IE8以下版本，fireEvent|attachEvent|detachEvent只能使用如下事件名
    var htmlEvents = {
        "onbeforeeditfocus": true,
        "onbeforeactivate": true,
        "onbeforepaste": true,
        "oncopy": true,
        "onmouseleave": true,
        "ondragstart": true,
        "ondatasetcomplete": true,
        "onscroll": true,
        "onrowsdelete": true,
        "onmouseup": true,
        "onbeforecut": true,
        "onclick": true,
        "onmoveend": true,
        "onkeypress": true,
        "onlayoutcomplete": true,
        "onmouseover": true,
        "onfocusin": true,
        "onrowenter": true,
        "ondblclick": true,
        "onmove": true,
        "onpage": true,
        "ondragleave": true,
        "ondragend": true,
        "onresize": true,
        "onmouseenter": true,
        "onresizeend": true,
        "onmousemove": true,
        "onresizestart": true,
        "onerrorupdate": true,
        "onkeyup": true,
        "onbeforedeactivate": true,
        "onmousedown": true,
        "oncut": true,
        "onrowsinserted": true,
        "oncellchange": true,
        "onfocus": true,
        "onmouseout": true,
        "ondragover": true,
        "onrowexit": true,
        "onfilterchange": true,
        "onfocusout": true,
        "onblur": true,
        "ondragenter": true,
        "ondrag": true,
        "ondataavailable": true,
        "onpropertychange": true,
        "onreadystatechange": true,
        "onselectstart": true,
        "onpaste": true,
        "onhelp": true,
        "onload": true,
        "ondeactivate": true,
        "onbeforeupdate": true,
        "onafterupdate": true,
        "onkeydown": true,
        "oncontrolselect": true,
        "oncontextmenu": true,
        "onbeforecopy": true,
        "onmovestart": true,
        "onactivate": true,
        "onlosecapture": true,
        "ondatasetchanged": true,
        "ondrop": true,
        "onselect": true,
        "onmousewheel": true,
        "onbeforeunload": true,
        "onafterprint": true,
        "onhashchange": true,
        "onbeforeprint": true,
        "onoffline": true,
        "ononline": true,
        "onunload": true
    };
    var isSupportCustomEvent = window.CustomEvent ? true : false;
    // https://github.com/krambuhl/custom-event-polyfill/blob/master/custom-event-polyfill.js
    // Polyfill for creating CustomEvents on IE9/10/11
    if (isSupportCustomEvent) {
        try {
            var ce = new window.CustomEvent('test');
            ce.preventDefault();
            if (ce.defaultPrevented !== true) {
                // IE has problems with .preventDefault() on custom events
                // http://stackoverflow.com/questions/23349191
                throw new Error('Could not prevent default');
            }
        } catch (e) {
            var CustomEvent = function(event, params) {
                var evt, origPrevent;
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };

                evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                origPrevent = evt.preventDefault;
                evt.preventDefault = function() {
                    origPrevent.call(this);
                    try {
                        Object.defineProperty(this, 'defaultPrevented', {
                            get: function() {
                                return true;
                            }
                        });
                    } catch (e) {
                        this.defaultPrevented = true;
                    }
                };
                return evt;
            };

            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent; // expose definition to window
        }
    }

    fireEvent = isSupportCustomEvent ? function(element, eventName, params) {
        var evt = document.createEvent('CustomEvent');
        if (params) {
            evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
        } else {
            evt.initCustomEvent(eventName, false, false, void(0));
        }
        if (element.dispatchEvent) {
            element.dispatchEvent(evt);
        }
    } : function(element, eventName, params) {
        var evt = document.createEventObject();
        evt.type = eventName;
        if (params) {
            evt.bubbles = Boolean(params.bubbles);
            evt.cancelable = Boolean(params.cancelable);
            evt.detail = params.detail;
        } else {
            evt.bubbles = false;
            evt.cancelable = false;
            evt.detail = void(0);
        }
        // fire
        if (element[eventName]) {
            element[eventName]();
        } else if (element['on' + eventName]) {
            element['on' + eventName]();
        } else if (element.fireEvent && htmlEvents['on' + eventName]) {
            element.fireEvent('on' + eventName, evt);
        }
    };
    addEvent = function(element, eventName, handler) {
        if (window.addEventListener) {
            addEvent = function(element, eventName, handler) {
                element.addEventListener(eventName, handler, false);
            }
        } else if (window.attachEvent && htmlEvents['on' + eventName]) {
            addEvent = function(element, eventName, handler) {
                element.attachEvent('on' + eventName, handler);
            }
        } else {
            addEvent = function(element, eventName, handler) {
                element['on' + eventName] = handler;
            }
        }
        addEvent(element, eventName, handler);
    };
    removeEvent = function(element, eventName, handler) {
        if (window.removeEventListener) {
            removeEvent = function(element, eventName, handler) {
                element.removeEventListener(eventName, handler, false);
            }
        } else if (window.attachEvent && htmlEvents['on' + eventName]) {
            removeEvent = function(element, eventName, handler) {
                element.detachEvent('on' + eventName, handler);
            }
        } else {
            removeEvent = function(element, eventName, handler) {
                element['on' + eventName] = null;
            }
        }
        removeEvent(element, eventName, handler);
    };

    return {
        fireEvent: fireEvent,
        addEvent: addEvent,
        removeEvent: removeEvent
    }
}();
