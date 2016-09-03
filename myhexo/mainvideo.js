require.config({
    baseUrl: './js/',
    paths: {
        jquery: 'lib/jquery-1.11.1',
        Zepto: 'lib/zepto',
        text: 'lib/text',
        underscore: 'lib/underscore'
    }
});


require([
	'Zepto'

], function($) {


	var w = $(window).width() - 20;
	var h = w * 0.8 ;

    $(".article-video").width=w;
    $(".article-video").height=h;






	// $(document).ready(function() {
	//   	$("#article-video").css({'width': w, 'height': h});
	// });

});

