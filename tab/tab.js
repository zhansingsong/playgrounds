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
    //'this' is window
    'use strict';
    /**
     * 可选配置项 options
     * @property {jQuery Object}    bSelector     tabItem选择器                [required]
     * @property {jQuery Object}    cSelector     tabContent选择器           [required]
     * @property {String}           bClassName    tabItem选中样式或hover样式   [required]
     * @property {Number}           numSelected   开始选中第几项             [optional]
     * @property {String}           triggerType   触发的事件类型             [optional]
     * @method onCallback   可以重写事件的回调处理函数                       [optional]
     */
    function Tab(options, element) {

        /**
         * @private property
         * 默认配置项 defaults
         * @property {Number}    numSelected   0
         * @property {String}    triggerType   'mouseenter'
         * @property {function}  onCallback    null
         */
        var _defaults = {
                numSelected: 0,
                triggerType: 'mouseenter',
                onCallback: null
            },
            //'this' is Tab
            me = this, //缓存this变量
            //  var meta  = this.$el.data('widget-plugin-opts');
            //  <div class="widget js-widget" data-widget-plugin-opts="{"optionA":"someCoolOptionString"}">
            meta,
        /**
         * @privileged method
         * 
         */
        this.getDefaults = function() {
           console.log('_defaults: ' + _defaults.numSelected);
           return _defaults;
        }

        /**
         * @public property
         * element    通过$()将DOM对象转为jquery对象并缓存起来
         * namespace  用于协助绑定或解绑定事件
         * settings   合并后的配置项  
         */
        this.element = $(element);
        this.namespace = "Tab";
        // $.extend(true, {}, defaults, options);可以传递第一个参数来实现深复制
        this.settings = $.extend({}, _defaults, options, meta || {});
        this.btns = this.settings['bSelector'];
        this.ctns = this.settings['cSelector'];

        this.init();
    }

    Tab.prototype = (function() {
        //定义私有方法——把私有方法定义在prototype中，确保每个实例共享一个副本。

        /**
         * @private _getSettings method
         * @param {String}  key  获取配置项的key
         */
        function _getSettings(key) {
            console.log('_getSettings: ' + this);
            var value = this.settings[key], //如果不用me, 而使用this,访问的是global window,原因当调用时, this相当于AO(acitve object),而AO在调用随函数执行完后，便变为空即null，此时浏览器会将其转换为global。
                requiredKey = {
                    bSelector: true,
                    cSelector: true,
                    bClassName: true
                };
            if (value === undefined && requiredKey[key]) {
                $.error('使用该插件必须提供 “' + key + '” 的值，不能为' + value);
            } else {
                return value;
            }
        }

        /**
         * @private _setCurrent method
         * @param {Number} index 当前的index 
         */
        function _setCurrent(index) {
            //如果不绑定this，_getSettings函数中this就不能正确获取，可能是undefined或window。
            var current = _getSettings.call(this, 'bClassName');

            this.btns.removeClass(current).eq(index).addClass(current);
            this.ctns.removeClass(current).eq(index).addClass(current);
        }

        function _destory() {
            this.btns.off('.' + this.namespace);
        }

        /**
         * @private method
         * init 初始化
         * @param {object} options 合并后的配置项settings
         */
        function _init() {
            var me = this;
            var index = this.getSettings('numSelected'),
                triggerType = _getSettings.call(this, 'triggerType'),
                onCallback = _getSettings.call(this, 'onCallback');
            _destory.call(this);
            _setCurrent.call(me, index);
            this.btns.on(triggerType + '.' + this.namespace, function(event) {
                event.preventDefault();
                // var $target = $(event.target).is('li')? $(event.target):$(event.target).parent();
                _setCurrent.call(me, $(this).index());
            });
        }

        return {
            // 确保constructor指向Tab
            constructor: Tab,

            test: function() {
                console.log('this is a test txt');
                // 执行链式
                console.log(this);
                return this;
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

    $.fn.tab = function(options) {
        var pluginName = "tabplugin",
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
            if (returnVal !== undefined){
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
                   $.data(this, pluginName, new Tab(options, this));
                }
            });
        }

        // return this;
    };
}));
