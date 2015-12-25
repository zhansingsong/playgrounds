// 支持UMD
;
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
      define(["jquery"], factory);
  } else if (typeof exports === "object") {
      module.exports = factory(require("jquery"));
  } else {
      root.Requester = factory(root.$);
  }
}(this, function($) {
  'use strict';
  // 支持IE6
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


  /**
   * 可选配置项 options
   * @property {jQuery Object}    cFloors   	[required]  	floor模块选择器           			
   * @property {jQuery Object}    cBtns     	[required]		elevator焦点按钮或图的选择器   
   * @property {String}           cSelected   [optional] 	 	焦点按钮或图的选中样式，默认为空
   * @property {object}           visible     [optional]    控制elevator初始化时的visibility，包含isHide, numShow两个字段
   * ---------@property  {String}  isHide     [optional]    控制elevator的是可见性，取值“yes|no”(大小写不敏感) ,默认为“no” ,当为“no”时，numShow设置无效
   * ---------@property  {Number}  numShow    [optional]    控制elevator的scrollTop值大于等于numShow的值时elevator可见，默认为0
   * @method   {function}         show        [optional]    控制elevator的显示方式，可以重写该方法来定制显示方式
   * @method   {function}  				hide			  [optional]		控制elevator的隐藏方式，可以重写该方法来定制隐藏方式
   */
  function Elevator(options, element) {
    /**
     * @private property
     * 默认配置项 defaults
     */
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
    meta = $(element).data('elevator-options');
    /**
     * @privileged method
     */
    this.getDefaults = function() {
        return _defaults;
    }

    /**
     * @public property
     * settings   合并后的配置项 , 优先级为：defaults < options < meta
     */
    this.settings = $.extend({}, _defaults, options, meta || {});
    this.buildCache(element);
    this.init();
  }

  Elevator.prototype = (function() {
    //定义私有方法——把私有方法定义在prototype中，确保每个实例共享一个副本。
    var _scrollTops = [],
    		_scrollTopsP;

  
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
          //处理抖动
          $('html').css({
            "backgroundImage": "url(about:blank)",
            "backgroundAttachment": "fixed"
          });
          return function (_sTop, _currentTop) {
            this.element.css('top', parseInt(_sTop, 10)  + _currentTop + 'px');
          }
        }
    })();
    /**
     * @private _buildCache
     * @description 缓存引用
     * @param {DOM Object}  element  elevator的引用
     */
   	function _buildCache(element) {
   		this.element = $(element);
   		this.floor = _getSettings.call(this, 'cFloors');
   		this.fbtns = _getSettings.call(this, 'cBtns');
   		this.len = this.fbtns.length;
   		this.namespace = 'Elevator';
   	}
    /**
     * @private _getSettings
     * @description 获取合并后的配置项
     * @param {String}  key  获取配置项的key
     */
    function _getSettings(key) {
    	//判断是否是setting中字段
  		if(key in this.settings) {
        var value = this.settings[key], //如果不用me, 而使用this,访问的是global window,原因当调用时, this相当于AO(acitve object),而AO在调用随函数执行完后，便变为空即null，此时浏览器会将其转换为global。
            requiredKey = {
                cFloors: true,
                cBtns: true
            };
        if ( !value  && requiredKey[key]) {
            $.error('使用该插件必须提供 “' + key + '” 的值，不能为' + value);
        } else {
            return value;
        }
      } else {
      	 		$.error('抱歉，该字段 “' + key + '” 不在配置项中！');
      }
    }

    /**
     * @private _ElevatorShow
     * @description 显示elevator
     */
    function _ElevatorShow() {
    		_getSettings.call(this, 'show')();
    }
    /**
     * @private _ElevatorHide
     * @description 隐藏elevator
     */
    function _ElevatorHide() {
    		_getSettings.call(this, 'hide')();
    }
    /**
     * @private _saveScrollTop
     * @description 缓存模块的scrollTop值
     */
    function _saveScrollTop() {
      debugger;
        this.floor.each(function() {
            _scrollTops.push($(this).offset().top);
        });
        _scrollTopsP = _scrollTops.slice();
    }
    /**
     * @private _getLocation
     * @description 获取scrollTop值，并返回当前索引
     * @param  {Number} num scrollTop值
     * @return {Number}     当前的索引值
     */
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
    /**
     * @private _setLocation
     * @description 设置scrollTop
     */
    function _setLocation(index) {
        if (index === -1) {
            return;
        }
        // $(window).scrollTop(_scrollTopsP[index]);
        var _speed = _getSettings.call(this, 'speed');
        $('html, body').animate({scrollTop: _scrollTopsP[index]}, _speed);
    }
    /**
     * @private _setBtns
     * 设置焦点按钮|图的选中样式
     */
    function _setBtns(index) {
  		var _selected = _getSettings.call(this, 'cSelected');
  	  this.fbtns.removeClass(_selected).eq(index).addClass(_selected);
    }
    /**
     * @private _bindEvents
     * @description 绑定事件
     */
    function _bindEvents() {
        var _me = this,
        		_speed = _getSettings.call(this, 'speed'),
            _currentTop = this.element.offset().top;
        this.fbtns.on('click.' + this.namespace, function(e) {
            var _index =  _me.fbtns.index($(this));
            if(_index === _me.len - 1){
            		// _index = 0;
            		$('html, body').animate({scrollTop: 0}, _speed);
            		return;
            }
            _setLocation.call(_me, _index);
        });
        $(window).on('scroll.' + this.namespace, function() {
            var _sTop = $(this).scrollTop(),
                _index = _getLocation.call(_me, _sTop);
            _supportIE6 && _supportIE6.call(_me, _sTop, _currentTop);
            _visible.call(_me, _sTop);
            _setBtns.call(_me, _index);
        });
    }
    /**
     * @private _unbindEvents
     * @description 解除绑定事件
     */
    function _unbindEvents() {
        this.element.off('.' + this.namespace);
        $(window).off('.' + this.namespace);
    }
    /**
     * @private _destory
     * @description 销毁
     */
    function _destory() {
        _unbindEvents.call(this);
        // 清除缓存数据
        $.removeData(this);
    }

    /**
     * @private _init
     * @description 初始化
     */
    function _init() {
        _visible.call(this); 
        _saveScrollTop.call(this);
        _bindEvents.call(this);
    }

    return {
        // 确保constructor指向Tab
        constructor: Elevator,

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
