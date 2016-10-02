canvas.prototype.drawlines = function(a, b) {//draw lines between balls
    if(typeof a == 'undefined') {return}
    this.ctx.beginPath()
    this.ctx.lineWidth = scaling(5)|0
    if(a instanceof Array) {
        this.ctx.moveTo(a[0].l + a[0].radius, a[0].t + a[0].radius)
        for(_i in a) {
            var i = parseInt(_i)
            if(i != 0) {
                var _d = distance({
                        x : a[i - 1].l,
                        y : a[i - 1].t
                    },
                    {
                        x : a[i].l,
                        y : a[i].t
                    })
                var color = '#' + ((_d / mostdistance * 16)|0).toString(16) + '00'
                this.ctx.strokeStyle = color
                this.ctx.lineTo(a[i].l + a[i].radius, a[i].t + a[i].radius)
            }
        }
    } else {
        if(typeof b == 'undefined') {return}
        var _d = distance({
                x : a.l,
                y : a.t
            },
            {
                x : b.l,
                y : b.t
            })
        var color = '#' + ((_d / mostdistance * 16)|0).toString(16) + '00'
        this.ctx.strokeStyle = '#000'
        this.ctx.moveTo(a.l + a.radius, a.t + a.radius)
        this.ctx.lineTo(b.l + b.radius, b.t + b.radius)
    }
    this.ctx.stroke()
}
var ballx = {
    size : 50,
    linecount : 7,
//    finger : {
//        size : 30
//    },
    scale : .9,
    scale2 : 1
}
//res.balls = {
//    finger : new Image('./finger.png'),
//    wall   : new Image('./wall.png')
//}
var FINGER = 'finger',
    WALL   = 'wall',
    EMPTY  = 'empty',
    PORTAL = 'portal',
    DOOR   = 'door'
var ballscollision = function(x, y, radius, bx, by, br) {
    var _a = Math.abs(x - bx),
        _b = Math.abs(y - by),
        _c = Math.sqrt(Math.pow(_a, 2) + Math.pow(_b, 2)),
        rr = radius + br
    if(_c <= rr) {
        return true
    }
    return false
}
/*var fingerscollisioncheck = function() {//{x, y, radius}
    for(_i in Game.fingers) {
        var i = parseInt(_i)
        var ax = Game.fingers[i].l - Game.fingers[i].radius * ballx.scale,
            ay = Game.fingers[i].t - Game.fingers[i].radius * ballx.scale,
            aradius = Game.fingers[i].radius
        for(j = i + 1; j < Game.fingers.length; j++) {
            console.log(i, j)
            var bx = Game.fingers[j].l - Game.fingers[j].radius * ballx.scale,
                by = Game.fingers[j].t - Game.fingers[j].radius * ballx.scale,
                bradius = Game.fingers[j].radius
            if(ballscollision(ax, ay, aradius, bx, by, bradius)) {return true}
        }
    }
    return false
}*/
var fingercollisionscheck = function(i, x, y) {//{x, y, radius}
    console.log('>', i)
    var ax = x - Game.fingers[i].radius * ballx.scale,
    //Game.fingers[i].l - Game.fingers[i].radius * ballx.scale,
        ay = y - Game.fingers[i].radius * ballx.scale,
    //Game.fingers[i].t - Game.fingers[i].radius * ballx.scale,
        aradius = Game.fingers[i].radius * .8
    for(_j in Game.fingers) {
        var j = parseInt(_j)
        if(i != j) {
            var bx = Game.fingers[j].l - Game.fingers[j].radius * ballx.scale,
                by = Game.fingers[j].t - Game.fingers[j].radius * ballx.scale,
                bradius = Game.fingers[j].radius
            if(ballscollision(ax, ay, aradius, bx, by, bradius)) {return true}
        }
    }
    return false
}
var fingersindoorscheck = function() {//{x, y, radius}
    var count  = 0
    var length = Game.fingers.length
    for(_i in Game.doors) {
        // опять торопят, вот и копипаста
        var i = parseInt(_i)
        var ax = Game.doors[i].l - Game.doors[i].radius * ballx.scale,
            ay = Game.doors[i].t - Game.doors[i].radius * ballx.scale,
            aradius = Game.doors[i].radius * .8
        for(_j in Game.fingers) {
            var j = parseInt(_j)
            //if(i != j) {
                var bx = Game.fingers[j].l - Game.fingers[j].radius * ballx.scale,
                    by = Game.fingers[j].t - Game.fingers[j].radius * ballx.scale,
                    bradius = Game.fingers[j].radius
//                console.log('door', i, 'finger', j, ax|0, ay|0, aradius|0, bx|0, by|0, bradius|0)
                if(ballscollision(ax, ay, aradius, bx, by, bradius)) {
                    console.log('***', count)
                    count += 1
                    Game.fingers[j].l = Game.doors[i].l
                    Game.fingers[j].t = Game.doors[i].t
                    Game.fingers[j].redraw()
                    Game.canvas.clear()
                    Game.canvas.drawlines(Game.fingers)
//                    return true
                }
            //}
        }
    }
    if(count == length) {
        return true
    }
    return false
}
var ballscollisioncheck = function(a) {//{x, y, radius}
    for(i in Game.balls) {
        var radius = Game.balls[i].radius * ballx.scale * .5,
            x = Game.balls[i].l - radius,
            y = Game.balls[i].t - radius

//        console.log('BOOBS', x, y, radius, a)
        if(ballscollision(x, y, radius, a.x, a.y, a.radius)) {return true}
    }
    return false
}
var distance = function(a, b) {
    var _a = Math.abs(a.x - b.x),
        _b = Math.abs(a.y - b.y)
    return Math.sqrt(Math.pow(_a, 2) + Math.pow(_b, 2))
}
var mostdistance = scaling(200)
var connect = function(index, x, y) {
    console.log('start check connect', mostdistance)
    for(_i in Game.fingers) {
        var i = parseInt(_i)
        if(i != index) {
            var _d = distance({
                    x : Game.fingers[i].l,
                    y : Game.fingers[i].t
                },
                {
                    x : x,
                    y : y
                })
            if(_d > mostdistance) {
                return false
            }
//            if(i != Game.fingers.length - 1) {
//                var _d = distance({
//                        x : Game.fingers[i].l,
//                        y : Game.fingers[i].t
//                    },
//                    {
//                        x : Game.fingers[i + 1].l,
//                        y : Game.fingers[i + 1].t
//                    })
//                console.log('***', _d, mostdistance)
//                if(_d > mostdistance) {
//                    return false
//                }
//            }
        }
    }
    return true
}
//var clearcanvas = function() {
//    Game.ctx.clearRect(0, 0, scaling().w, scaling().h)
//}
//var drawconnect = function() {
//    Game.ctx.beginPath()
//    Game.ctx.moveTo(Game.fingers[0].l, Game.fingers[0].t)
//    Game.ctx.lineWidth = scaling(5)|0
//    Game.ctx.strokeStyle = '#000'
//    for(i in Game.fingers) {
//        if(i != 0) {
//            Game.canvas.drawline(Game.fingers)
            //Game.ctx.lineTo(Game.fingers[i].l, Game.fingers[i].t)
//        }
//    }
//    Game.ctx.stroke()
//}
var fallscroll = 0,
    fallstep = 3
/*var fallcontrollertimer
var fallcontrollertimerdebug = false
var fallcontroller = function() {
    if(fallcontrollertimerdebug) {return}
    fallscroll += fallstep
    if(fallscroll >= ballx.size + ballx.distance) {
        fallscroll = 0
        addrandomline(-1)
    }
    for(i in Game.balls) {
        if(typeof Game.balls[i] != 'undefined') {
//        Game.balls[i].fall()
            Game.balls[i].t += fallstep
            Game.balls[i].redraw()
            if(Game.balls[i].t >= Game.h) {
                $(Game.balls[i].el).remove()
                delete Game.balls[i]
            }
        }
    }
    var f = false
    for(i in Game.fingers) {
        var _this = Game.fingers[i]
        if(ballscollisioncheck({x : _this.l, y : _this.t, radius : _this.radius})) {
            Game.over()
        }
    }
    fallcontrollertimer = setTimeout(function() {fallcontroller()}, 10)
}*/
var drawball = function(x, y, type) {
    var _x = ballx.distance + x * ballx.distance + x * ballx.size + ballx.size / 2,
        _y = ballx.distance + y * ballx.distance + y * ballx.size + ballx.size / 2
//    if(type == FINGER) {
//        Game.fingers.push(new ball({x : _x, y : _y}, type))
//    }
//    if(type == WALL) {
//        Game.balls.push(new ball({x : _x, y : _y}, type))
//    }
    return new ball({x : _x, y : _y}, type)
}
/*var addrandomline = function(y) {
    if(Math.random() > .5) {return}
    var x1, x2, x3
    x1 = (Math.random() * ballx.linecount)|0
    do {
        x2 = (Math.random() * ballx.linecount)|0
    } while(x1 == x2)
    //drawball(x1, y, WALL)
    drawball(x2, y, WALL)
    if(Math.random() > .5) {
        do {
            x3 = (Math.random() * ballx.linecount)|0
        } while(x3 == x1 || x3 == x2)
        drawball(x3, y, WALL)
    }
}*/
/*var addnewline = function(y1) {
    for(x1 = 0; x1 < ballx.linecount; x1++) {
        var x = parseInt(x1),
            y = parseInt(y1)
        drawball(x, y, FINGER)
    }
}*/
var fingersmovestarted = false
var ball = function(a, type) {//{x, y}, canvas.context, FINGER|WALL
//    console.log('add ball', a, type)
//    this.ctx = ctx
    this.w = ballx.size
    this.h = ballx.size
    this.el = document.createElement('div')
    $(Game.elcontainer).append(this.el)
    var _this = this,
        f0 = function(e) {
            e.preventDefault()
            var c = e.targetTouches[0]
            _this._ll = c.pageX - _this.l
            _this._tt = c.pageY - _this.t
        },
        f1 = function(e) {
            if(Game._win) {return}
            if(Game._over) {return}
            if(!fingersmovestarted) {
//                fallstep = scaling(fallstep)
//                fallcontroller()
                drawtimer()
                Game.timer = new timerup()
                fingersmovestarted = true
            }
            e.preventDefault()
            var c = e.targetTouches[0]
            var newl = c.pageX - _this._ll,
                newt = c.pageY - _this._tt// - scaling(50)
            console.log('>>>', _this.index)
            if(!fingercollisionscheck(_this.index, newl, newt) && connect(_this.index, newl, newt)) {
                _this.l = newl
                _this.t = newt
                _this.redraw()
                //clearcanvas()
                Game.canvas.clear()
                //drawconnect()
                Game.canvas.drawlines(Game.fingers)
                if(ballscollisioncheck({x : _this.l, y : _this.t, radius : _this.radius})) {
                    Game.over()
                }
            }
            if(fingersindoorscheck()) {
               Game.win()
            }
        }
    $(this.el).addClass('el ball')
    $(this.el).addClass(type)
    if(type == FINGER) {
//        this.w *= ballx.scale2
//        this.h *= ballx.scale2
        this.el.addEventListener('touchstart', f0)
        this.el.addEventListener('touchmove', f1)
    }
    if(type == WALL) {
        this.w *= ballx.scale
        this.h *= ballx.scale
    }
    this.radius = this.w / 2
    this.l = a.x - this.radius
    this.t = a.y - this.radius
//    console.log('*', this.w, this.h, this.l, this.t)
    $(this.el)
        .css({
            width  : this.w + 'px',
            height : this.h + 'px'
        })
    this.redraw = function() {
        $(this.el)
            .css({
//                width  : this.w + 'px',
//                height : this.h + 'px',
                left   : this.l + 'px',
                top    : this.t + 'px'
            })
//        console.log('redraw', this.l, this.t, this.w, this.h)
//        var width  = Math.round(this.w),
//            height = Math.round(this.h),
//            left   = Math.round(this.l),
//            top    = Math.round(this.t)
//        try {
//            this.ctx.drawImage(res.balls[type], left, top, width, height)
//        } catch(e) {}
    }
    this.redraw()
}