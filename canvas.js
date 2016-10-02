var canvas = function(w, h) {
    console.log('new canvas')
    if(typeof w == 'undefined') {this.w = Game.w} else {this.w = w}
    if(typeof h == 'undefined') {this.h = Game.h} else {this.h = h}
    var canvas = document.createElement('canvas')
    canvas.width  = this.w
    canvas.height = this.h
    this.ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    this.clear = function() {
        this.ctx.clearRect(0, 0, this.w, this.h)
    }
}