/**
 * Created by zmouse on 2015/11/5.
 */
/*function move(obj, attr, target, duration, fx, callback) {
    obj.timers = obj.timers || {};
    clearInterval(obj.timers[attr]);
    var b = parseInt( css( obj, attr ) );
    var c = target - b;
    var d = duration || 1000;
    var startTime = +new Date();

    obj.timers[attr] = setInterval(function() {

        var t = +new Date() - startTime;
        if (t >= d) {
            t = d;
            clearInterval(obj.timers[attr]);
        }
        var value = Tween[fx](t, b, c, d);

        obj.style[attr] = value + 'px';

        if (t == d) {
            callback && callback();
        }

    }, 16);
}*/

function move(obj, attrs, callback) {
    clearInterval(obj.timer);

    /*var b = parseInt( css( obj, attr ) );
    var c = target - b;*/

    /*
     * j = {
     *    width : {
     *       b :
     *       c :
     *    },
     *    height: {
     *       b :
     *      c :
     *    }
     * }
     * */

    var j = {};
    var ds = [];
    for (var attr in attrs) {
        j[attr] = {};
        //b值
        //j[attr].b = parseInt(css(obj, attr));
        //透明的处理，把透明转成0-100的值进行运算
        if (attr == 'opacity') {
            j[attr].b = Math.round(css(obj, attr) * 100);
        } else {
            j[attr].b = parseInt(css(obj, attr));
        }
        //c值
        j[attr].c = attrs[attr].target - j[attr].b;
        j[attr].d = attrs[attr].duration;
        j[attr].fx = attrs[attr].fx;
        ds.push(attrs[attr].duration);
    }

    var d = Math.max.apply(null, ds);
    var startTime = +new Date();

    //console.log(j, d);
    //return;

    //每一次开启定时器的，同时去改变多个不同的属性
    obj.timer = setInterval(function() {
       
        var t = +new Date() - startTime;
        if (t >= d) {
            t = d;
            clearInterval(obj.timer);
        }

        //要通过一个for in的循环去把要改变的属性依次计算并赋值
        //不同的属性的初始值b和距离c不一定是一样的
        //但是不同的属性的持续时间d和已过的时间t是一样，可以公用的
        /*
        * j = {
        *    width : {
        *       b :
        *       c :
        *    },
        *    height: {
        *       b :
         *      c :
        *    }
        * }
        * */
        for (var attr in attrs) {
            if (t <= j[attr].d) {
                var value = Tween[j[attr].fx](t, j[attr].b, j[attr].c, j[attr].d);
                if (attr == 'opacity') {
                    obj.style.opacity = value / 100;
                    obj.style.filter = 'alpha(opacity='+value+')';
                } else {
                    obj.style[attr] = value + 'px';
                }
            }
        }

        if (t == d) {
            callback && callback();
        }

    }, 16);
}

function css(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj)[attr];
    }
}

/*
 * t : time 已过时间
 * b : begin 起始值
 * c : count 总的运动值
 * d : duration 持续时间
 * */

//Tween.linear();

var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}