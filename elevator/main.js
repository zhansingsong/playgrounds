require.config({　　
    paths: {　　　　
        "jquery": "js/jquery-1.8.2",
        "elevator": "elevator"　　
    }
});
require(["elevator"], function() {
    $('#elevator').elevator({
        cFloors: $('.js-floor'),
        cBtns: $('.js-btn'),
        cSelected: 'selected',
        visible: {
            isHide: 'yes',
            numShow: 400
        },
        show: function() {
            $('#elevator').slideDown(400);
        },
        hide: function() {
            $('#elevator').slideUp(400);
        }
    }).elevator('getDefaults');
});
