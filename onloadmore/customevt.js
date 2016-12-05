/**
 * customevt
 * 
 * @description 
 * customevt is a cross-browser custom evetns library in vanilla javascript without any frameworks
 * 
 * @method 
 * fireEvent
 * addEvent
 * removeEvent
 * 
 * @example
 * customevt.addEvent(window.document.body, 'test', function(e){alert('test')});    
 * customevt.fireEvent(window.document.body, 'test');
 * 
 */
(function(win, customevt) {
    var fireEvent,
        addEvent,
        off,
        one;
   
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
        return evt;
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
            element[eventName](evt);
        } else if (element['on' + eventName]) {
            element['on' + eventName](evt); 
        } else if (element.fireEvent && ('on' + eventName) in element) { //针对IE8及以下版本，fireEvent|attachEvent|detachEvent只能使用如下事件名
            element.fireEvent('on' + eventName, evt);
        }
        return evt;
    };
    addEvent = function(element, eventName, handler) {
        if (window.addEventListener) {
            addEvent = function(element, eventName, handler) {
                element.addEventListener(eventName, handler, false);
            }
        } else if (window.attachEvent && ('on' + eventName) in element) {
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
        } else if (window.attachEvent && ('on' + eventName) in element) {
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
    
    customevt.fireEvent = fireEvent;
    customevt.addEvent = addEvent;
    customevt.removeEvent =removeEvent;

})(window, window['customevt'] || (window['customevt'] = {}));

// module.exports = customevt;
