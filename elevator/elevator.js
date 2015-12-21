// 支持UMD
;
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function($) {
    'use strict';
    /**
     * 可选配置项 options
     * @property {jQuery Object}    cFloors   	[required]  	floor模块选择器              			
     * @property {jQuery Object}    cBtns     	[required]		elevator焦点按钮或图的选择器      
     * @property {String}           cSelected   [required] 	 	焦点按钮或图的选中样式           	
     * @property {Number}  					numShow			[optional]		当scrollTop值大于numShow时，就显示elevator，反之则。
     * 
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
        	numShow: 0,
        	show: function () {
        		this.element.show();
        	},
        	hide: function () {
        		this.element.hide();
        	}
        },
            me = this, //缓存this变量
            meta;
            /**
             * @privileged method
             */
            this.getDefaults = function() {
                return _defaults;
            }

        /**
         * @public property
         * element    通过$()将DOM对象转为jquery对象并缓存起来
         * namespace  用于协助绑定或解绑定事件
         * settings   合并后的配置项  
         */
        // this.element = $(element);
        // this.fbtns = this.element.find('ul li a');
        // this.len =  this.fbtns.length;
        // this.floor = $('.js-floor');
        // this.namespace = "Elevator";
        // debugger;
        this.settings = $.extend({}, _defaults, options, meta || {});
        this.buildCache(element);
        this.init();
    }

    Elevator.prototype = (function() {
            //定义私有方法——把私有方法定义在prototype中，确保每个实例共享一个副本。
            var _scrollTops = [],
            		_scrollTopsP;

           	function _buildCache(element) {
           		this.element = $(element);
           		this.floor = _getSettings.call(this, 'cFloors');
           		this.fbtns = _getSettings.call(this, 'cBtns');
           		this.len = this.fbtns.length;
           		this.namespace = 'Elevator';
           	}
            /**
             * @private _getSettings method
             * @param {String}  key  获取配置项的key
             */
            function _getSettings(key) {
            	// debugger;
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

            function _saveScrollTop() {
                this.floor.each(function() {
                    _scrollTops.push($(this).offset().top);
                });
                _scrollTopsP = _scrollTops.slice();
            }
            function _ElevatorShow() {
            		_getSettings.call(this, 'show')();
            }
            function _ElevatorHide() {
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

            function _setLocation(index) {
                if (index === -1) {
                    return;
                }
                // $(window).scrollTop(_scrollTopsP[index]);
                $('html, body').animate({scrollTop: _scrollTopsP[index]}, 300);
            }

            function _setBtns(index) {
          		var _selected = _getSettings.call(this, 'cSelected');
          	  this.fbtns.removeClass(_selected).eq(index).addClass(_selected);
            }

            function _bindEvents() {
                var _me = this;
                this.element.on('click.' + this.namespace, 'li a', function(e) {
                    var _index =  _me.fbtns.index($(this));
                    if(_index === _me.len - 1){
                    		// _index = 0;
                    		$('html, body').animate({scrollTop: 0}, 300);
                    		return;
                    }
                    _setLocation.call(_me, _index);
                });
                $(window).on('scroll.' + this.namespace, function() {
                    var _sTop = $(this).scrollTop(),
                        _index = _getLocation.call(_me, _sTop);
                    if(_sTop > _getSettings.call(_me, 'numShow')) {
                    	_ElevatorShow.call(_me);
                    } else {
                    	_ElevatorHide.call(_me);
                    }
                    _setBtns.call(_me, _index);
                });
            }

            function _unbindEvents() {
                this.element.off('.' + this.namespace);
                $(window).off('.' + this.namespace);
            }

            function _destory() {
                _unbindEvents.call(this);
                // 清除缓存数据
                $.removeData(this);
            }

            /**
             * @private method
             * init 初始化
             * @param {object} options 合并后的配置项settings
             */
            function _init() {
            		this.element.hide();
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
                getSettings: function(key) {
                    return this._(_getSettings)(key);
                },
                option: function(property, value) {
                    if (typeof property === 'object') {
                        options = $.extend(options, property);
                    } else if (options[property] !== undefined) {
                        if (value === undefined) {
                            return options[property];
                        } else {
                            options[property] = value;
                        }
                    } else if (!property) {
                        return options;
                    } else {
                        $.error('Option ' + property + ' does not exist on jQuery.swipe.options');
                    }

                    return null;
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
        var pluginName = "elevatorPlugin",
            args,
            returnVal;

        if (typeof options === 'string') {
            args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var pluginInstance = $.data(this, pluginName);

                if (!pluginInstance) {
                    $.error("The plugin has not been initialised yet when you tried to call this method: " + options);
                    return;
                }
                if (!$.isFunction(pluginInstance[options])) {
                    $.error("The plugin contains no such method: " + options);
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

                var pluginInstance = $.data(this, pluginName);
                if (pluginInstance) {
                    pluginInstance.option(options);
                } else {
                    $.data(this, pluginName, new Elevator(options, this));
                }
            });
        }
    };
 }));
