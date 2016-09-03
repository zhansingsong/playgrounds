	require.register("./test2.js", function(module, exports, require){
  module.exports = function() {
    console.log(x);
  };
});