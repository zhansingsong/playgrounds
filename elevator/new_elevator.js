// UMD support
;(function(root, factory) {
  if (typeof define === "function" && define.amd) {
      define(["jquery"], factory);
  } else if (typeof exports === "object") {
      module.exports = factory(require("jquery"));
  } else {
      root.Requester = factory(root.$);
  }
}(this, function($) {
  'use strict';
  // IE6 support
  if (typeof Array.prototype.indexOf !== 'function') {
      Array.prototype.indexOf = function(item) {
          for (var i = this.length - 1; i >= 0; i--) {
              if (this[i] === item) {
                  return i;
              }
          }
      }
  }

  function IETest(version) {
      var b = document.createElement('b');
      b.innerHTML = '<!--[if IE '+version+']><i></i><![endif]-->';
      return b.getElementsByTagName('i').length === 1;
  }

  function iElevator(options, element) {
		// cache for context
		this.element = $(element);
		this.namespace = 'iElevator';
		// defaults
		var _defaults = {
				cFloors: null,
				cBtns: null,
				cSelected: '',
			  visible: {isHide: 'no', numShow: 0},
				speed: 400,
				show: function () {
					this.element.show();
					},
				hide: function () {
					this.element.hide();
					}
				},
				meta = this.element.data('iElevator-options') || {};
		// configurations extended
		this.settings = $.extend({}, _defaults, options, meta);
  }

  iElevator.prototype = (function() {
  	// caching scrollTop(value) of each module
  	var _scrollTopArr = [],
  			_STARR;

  	/**
  	 * lazy definition visible
  	 * @private _visible
  	 */
  	var _visible = function (_sTop) {
	  	  var _parent = _getSettings.call(this, 'visible'),
	  	      _isHide = _parent.isHide.toLowerCase(),
	  	      _numShow = _parent.numShow;
	  	    if(_isHide === 'yes') {
	  	      this.element.hide();
	  	    } else {
	  	      _numShow = 0;
	  	    }
	  	    _visible = function (_sTop) {
	  	    if(_sTop >= _numShow) {
	  	      _ElevatorShow.call(this);
	  	    } else {
	  	      _ElevatorHide.call(this);
	  	    }
	  	  }
  		},
  	  _supportIE6 = (function () {
  	    if(IETest(6)){
  	      // Anti-shake
  	      $('html').css({
  	        "backgroundImage": "url(about:blank)",
  	        "backgroundAttachment": "fixed"
  	      });
  	      return function (_sTop, _currentTop) {
  	        this.element.css('top', parseInt(_sTop, 10)  + _currentTop + 'px');
  	      }
  	    }
  	})();

  	function _initPattern() {

  	}

	  function _getSettings(key) {
	  	// to verify whether settings contains key or not
			if(key in this.settings) {
	      var _value = this.settings[key],
	          requiredKey = {
	              cFloors: true,
	              cBtns: true,
	              cBacktop: true
	          };
	      if ( !_value  && requiredKey[key]) {
	          $.error('the “' + key + '” is required，not ' + _value);
	      } else {
	          return _value;
	      }
	    } else {
	    	 		$.error('the settings contains no such “' + key + '” option!');
	    }
	  }

	  function _elevatorShow() {
	  		_getSettings.call(this, 'show')();
	  }

	  function _elevatorHide() {
	  		_getSettings.call(this, 'hide')();
	  }

	  function _getLocation(num) {
	      var _num = parseInt(num, 10),
	          _index = _scrollTops.indexOf(_num);
	      if(_index > -1) {
	      	return _index;
	      }
	      _scrollTops.push(_num);
	      _scrollTops.sort(function(A, B) {
	              return A - B;
	          });
	      _index = _scrollTops.indexOf(_num);
	      _scrollTops.splice(_index, 1);
	      return (_index - 1);
	  }

	  function _setLocation(index, _speed) {
	      if (index === -1) {
	          return;
	      }
	      // $(window).scrollTop(_scrollTopsP[index]);
	      // var _speed = _getSettings.call(this, 'speed');
	      $('html, body').animate({scrollTop: _scrollTopsP[index]}, _speed);
	  }

    function _setBtns(index) {
  		var _selected = _getSettings.call(this, 'cSelected');
  	  this.fbtns.removeClass(_selected).eq(index).addClass(_selected);
    }

    function _bindEvents() {
        var _me = this,
        		_speed = _getSettings.call(this, 'speed'),
            _currentTop = this.element.offset().top;
        this.fbtns && this.fbtns.on('click.' + this.namespace, function(e) {
            var _index =  _me.fbtns.index($(this));
            if(_index === _me.len - 1){
            		// _index = 0;
            		$('html, body').animate({scrollTop: 0}, _speed);
            		return;
            }
            _setLocation.call(_me, _index, _speed);
        });
        this.backtop && this.backtop.on('')
        $(window).on('scroll.' + this.namespace, function() {
            var _sTop = $(this).scrollTop(),
                _index = _getLocation.call(_me, _sTop);
            _supportIE6 && _supportIE6.call(_me, _sTop, _currentTop);
            _visible.call(_me, _sTop);
            _setBtns.call(_me, _index);
        });
    }

    function _unbindEvents() {
        this.element.off('.' + this.namespace);
        $(window).off('.' + this.namespace);
    }

    function _destory() {
        _unbindEvents.call(this);
        // clear cache data
        $.removeData(this);
    }

    return {
        // ensure constructor point to iElevator(constuctor === iElevator)
        constructor: iElevator,

        buildCache: function(element) {
					this._(_buildCache)(element);
        },
        init: function() {
          this._(_init)();
        },
        destory: function () {
        	console.log('destory');
        	this._(_destory)();
        },
        getSettings: function(key) {
            return this._(_getSettings)(key);
        },
        _: function(callback) {
            //缓存this
            var self = this;
            return function( /*argument*/ ) {
                return callback.apply(self, arguments);
            }
        }
    }

  })();

	$.fn.elevator = function(options) {
	    var PLUGIN_NS = "elevatorPlugin",
	        args,
	        returnVal;

	    if (typeof options === 'string') {
	        args = Array.prototype.slice.call(arguments, 1);
	        this.each(function() {
	            var pluginInstance = $.data(this, PLUGIN_NS);

	            if (!pluginInstance) {
	                $.error('该插件还没有初始化: ' + options);
	                return;
	            }
	            if (!$.isFunction(pluginInstance[options])) {
	                $.error('抱歉，该插件没有这个: '  + options + '方法');
	                return;
	            } else {
	                returnVal = pluginInstance[options].apply(pluginInstance, args);
	            }
	        });
	        if (returnVal !== undefined) {
	            // If the method returned a value, return the value.
	            return returnVal;
	        } else {
	            // Otherwise, returning 'this' preserves chainability.
	            return this;
	        }

	    } else {
	        return this.each(function() {

	            var pluginInstance = $.data(this, PLUGIN_NS);
	            if (pluginInstance) {
	                pluginInstance.option(options);
	            } else {
	                $.data(this, PLUGIN_NS, new Elevator(options, this));
	            }
	        });
	    }
	};
}));