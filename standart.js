var splash = function(x, y, s, f, t, color) {
    if(typeof color == 'undefined') {
        color = '#fff'
    }
    t = (typeof t == 'undefined') ? 0 : t;
    $('body').append(
        $('<div>')
            .css({
                top              : y - scaling(10) + 'px',
                left             : '0px',
                width            : scaling().w + 'px',
                height           : scaling(10) + 'px'
            })
            .html(s)
//            .attr({
//                id : 'splash'
//            })
            .addClass('splash')
            .animate({
                lineHeight : (scaling(30)|0) + 'px',
                fontSize   : (scaling(27)|0) + 'pt',
                height     : (scaling(100)|0) + 'px',
                top        : y - (scaling(50)|0) + 'px'
            }, function() {
                setTimeout(function() {
                    $('.splash')
                        .animate({
                            'font-size' : '1pt'
                        }, function() {
//                            $('#splash').remove()
                            $('.splash').remove()
                            if(typeof f == 'function') {f()}
                        })
                }, t)
            })
    )
}
//----------------------------------------------------------------------------------------------------------------------
var timerback = function() {
    time -= 1;
    var _m = (time / 60)|0,
        _s = time % 60
    _m = (_m > 9)?_m:'0' + _m
    _s = (_s > 9)?_s:'0' + _s
    if(time > 0) {
        $('#time').html(_m + '-' + _s)
        setTimeout(function(){timer()}, 1000)

    } else {
//        splash(scaling().w / 2, scaling().h / 2, lang.score + points, function(){document.location.reload()}, 1000)
    }
}
var timerup = function() {
    this.time = new Date().getTime()
    this.repeater = function() {
        var newtime = ((new Date().getTime() - this.time) / 1000)| 0,
            m = (newtime / 60)| 0,
            s = newtime % 60
        m = (m > 9)?m:'0' + m
        s = (s > 9)?s:'0' + s
        this.min = m
        this.sec = s
        $('#time>#min').html(this.min)
        $('#time>#sec').html(this.sec)
        var _this = this
        this.timer = setTimeout(function() {
            _this.repeater()
        }, 1000)
    }
    this.repeater()
}
var drawtimer = function() {
    $(Game.elcontainer).append(
        $('<div>')
            .attr({id : 'bar'})
            .css({
                width  : scaling().w + 'px',
                height : scaling(20) + 'px',
                fontSize : (scaling(12)|0) + 'pt',
                top    : '0px',
                left   : '0px'
            })
            .append(lang.time)
            .append(' : ')
            .append(
                $('<span>')
                    .attr({id : 'time'})
                    .append($('<span>').attr({id : 'min'}))
                    .append('-')
                    .append($('<span>').attr({id : 'sec'}))
            )
    )
}
//----------------------------------------------------------------------------------------------------------------------
var point = function(a) {
    //$('.point1').remove()
//    console.log(a.color, a.x, a.y)
    $('body').append(
        $('<div>')
            .addClass('point1')
            .css({
                position   : 'absolute',
                background : a.color,
                left       : a.x - 2 + 'px',
                top        : a.y - 2 + 'px',
                width      : '3px',
                height     : '3px',
                border     : '1px solid #fff'
            })
    )
}
//----------------------------------------------------------------------------------------------------------------------
//            var x = c.pageX,
//                y = c.pageY,
//				a = _this.center.x - x,
//				b = _this.center.y - y,
//                c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
//				alpha = (180+90) - Math.asin(b / c) * 180 / Math.PI - 90 - 45 - 180
//                alpha *= .5
//                alpha = (a < 0)?(360 - alpha):alpha
//                alpha = (alpha > 360)?(alpha - 360):alpha
//                alpha = (alpha < 0)?(360 + alpha):alpha
//                _this.alpha = alpha|0