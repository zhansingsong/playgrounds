(function (factory) {
	factory();
})(function () {
    Tab = function () {

    };
	Tab.prototype  = (function () {
		function A() {
			console.log('A:  '+ this);
		}
		function B(){
			console.log(this);
			var bar = 'haha';
			A();
		}
		return{
				B:function () {
		           this._(B)();
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

(new Tab()).B();
})


