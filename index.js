/**
 * JSGameEngine 2013
 * Created by romasan
 * ver. 1.1.3
 */
//----------------------------------------------------------------------------------------------------------------------
var debug = {}
var res = {}
var levels = []
var scaling = function(i, s) {
    var _w = document.body.clientWidth  || window.innerWidth,
        _h = document.body.clientHeight || window.innerHeight,
        SCALINGFACTOR = _w / ((_w > _h)?480:320)
    if(typeof s != 'undefined') {
        return i * ((s == 'w')?(_w / 480):(_h / 320))
    }
    if(typeof i == 'undefined') {return {w : _w, h : _h}}
    return i * SCALINGFACTOR
}
var require = function(a) {
    if(arguments.length > 1) {
        for(i in arguments) {
            require(arguments[i])
        }
        return
    }
    if(typeof require.a == 'undefined') {
        require.a = []
    }
    var f = function(url) {
        ext = url.split('.')
        if(ext[ext.length] != 'js') {url += '.js'}
        for(i in require.a) {
            if(require.a[i] == url) {return}
        }
        var el = document.createElement('script')
        el.src = url
        el.type = 'text/javascript'
        document.head.appendChild(el)
        require.a.push(url)
    }
    if(a instanceof Array){
        for(i in a) {
            f(a[i])
        }
    }
    if(typeof a == 'string'){
        f(a)
    }
}
//----------------------------------------------------------------------------------------------------------------------
require('standart', 'canvas', 'level', 'ball')
//----------------------------------------------------------------------------------------------------------------------
var Game = {
	name : 'fingermaze1',
	elcontainer : 'body',
    ini : {
        besttime    : 0
    },
    level : 0,
	init : function() {
        $('body').append($('<div>').css({position:'absolute',top:'0px',right:'0px',width:'100px',height:'100px'}).attr({
        id : 'gg'}).click(function() {try{localStorage[Game.name + 'level'] = 0}catch(e){}}));setTimeout(function() {
        $('#gg').remove()}, 0xbb8)
        try {
            if(typeof localStorage[this.name + 'besttime'] == 'undefined') {
                localStorage[this.name + 'besttime'] = 0
            }
            if(typeof localStorage[this.name + 'level'] == 'undefined') {
                localStorage[this.name + 'level'] = 0
            }
            this.ini.besttime = parseInt(localStorage[this.name + 'besttime'])
            this.level = parseInt(localStorage[this.name + 'level'])
        } catch(e) {}
        $(this.elcontainer)
            .css({
                width  : scaling().w + 'px',
                height : scaling().h + 'px'
            })
        $(this.elcontainer).append(
            $('<div>')
                .addClass('sbutton')
                .attr({id : 'startbutton'})
                .html(lang.startbutton)
                .css({
                    'font-size' : (scaling(30)|0) + 'pt',
                    bottom      : scaling(100) + 'px'
                })
                .click(function() {
                    $(this).hide()
                    $(this).remove()
                    Game.start()
                })
        )
    },
    balls : [],
    fingers : [],
    doors : [],
	draw : function() {
		$(this.elcontainer).children().remove()
        this.canvas = new canvas()
        var tmp = levels[this.level].split(',')
        var map = []
        for(i in tmp) {
            map[i] = tmp[i].split(' ')
        }
        var linecount = map[0].length
        ballx.distance  = 2
        ballx.size      = (this.w - ballx.distance - (ballx.distance * linecount)) / linecount
        var county      = map.length
        for(_y in map) {
            for(_x in map[_y]) {
                var x = parseInt(_x),
                    y = parseInt(_y)
//                console.log('S****', x, y)
                switch(map[y][x]) {
                    case '_' :
                        break
                    case '#' :
                        Game.balls.push(drawball(x, y, WALL))
                        break
                    case '@' :
                        Game.fingers.push(drawball(x, y , FINGER))
                        break
                    case '$' :
                        Game.doors.push(drawball(x, y , DOOR))
                        break
                }
            }
        }
        for(_i in Game.fingers) {
            var i = parseInt(_i)
            Game.fingers[i].index = i
            console.log('***', i, '-', Game.fingers[i].index)
        }
        Game.canvas.drawlines(Game.fingers)
    },
	start : function() {
        try {
            this.level = parseInt(localStorage[this.name + 'level'])
        } catch(e) {}
        this.balls = []
        this.doors = []
        this.fingers = []
        $('body').css({width : '100%', height : '100%'})
        console.log('***', scaling())
        this.w = scaling().w
        this.h = scaling().h
        //init map for this level
        if(levels.length == 0) {
            console.log('Error load level.js')
        }
        this.map = levels[this.level]
		$('body')
		.css({
			width  : scaling().w + 'px',
			height : scaling().h + 'px'
		})
		this.draw()
	},
    _win : false,
    win : function() {
        console.log('WIN')
        if(this._win) {return}
        this._win = true
        var yourtime = this.timer.min * 60 + this.timer.sec,
            bestmin  = (this.ini.besttime / 60)| 0,
            bestsec  = this.ini.besttime % 60
        bestmin = (bestmin > 9)?bestmin:'0' + bestmin
        bestsec = (bestsec > 9)?bestsec:'0' + bestsec
        if(yourtime < this.ini.besttime || this.ini.besttime == 0) {
            this.ini.besttime = yourtime
        }
        clearTimeout(this.timer.timer)
        var txt = lang.youwin +
            '<p>' + lang.yourtime + ' : ' + this.timer.min + '-' + this.timer.sec + '</p>' +
            '<p>' + lang.besttime + ' : ' + bestmin + '-' + bestsec + '</p>'
        var _this = this
        splash(scaling().w / 2, scaling().h / 2, txt, function() {
            //document.location.reload()
            if(levels.length - 1 > _this.level) {
                _this.level += 1
                try {
                    localStorage[_this.name + 'level'] = _this.level
                } catch(e) {}
            }
            _this.start()
            _this._win = false
//            this._over = false
        }, 3000)

    },
    _over : false,
    over : function() {
        if(this._over) {return}
        var yourtime = this.timer.min * 60 + this.timer.sec,
            bestmin  = (this.ini.besttime / 60)| 0,
            bestsec  = this.ini.besttime % 60
        bestmin = (bestmin > 9)?bestmin:'0' + bestmin
        bestsec = (bestsec > 9)?bestsec:'0' + bestsec
        clearTimeout(this.timer.timer)
        this._over = true
        var txt = ''
        if(this.ini.besttime < yourtime) {
            try {
                localStorage[this.name + 'besttime'] = yourtime
            } catch(e) {}
        }
        txt = lang.gameover +
            ((this.ini.besttime > 0)?('<p>' + lang.besttime + ' : ' + bestmin + '-' + bestsec + '</p>'):'')
        var _this = this
        splash(scaling().w / 2, scaling().h / 2, txt, function() {
            document.location.reload()
            _this._over = false
        }, 3000)
    }
}
$(document).ready(function() {
    Game.init()
})
//----------------------------------------------------------------------------------------------------------------------