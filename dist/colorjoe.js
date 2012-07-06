/*! colorjoe - v0.3.0 - 2012-07-06
* http://bebraw.github.com/colorjoe/
* Copyright (c) 2012 Juho Vepsäläinen; Licensed MIT */

/*
 * References:
 * * http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
 * * http://stackoverflow.com/questions/1291325/drag-drop-problem-draggable-in-positionrelative-parent
 *
 * Note that default drag does not work with position: relative by default!
 * */
(function(root, factory) {
    if(typeof define === 'function' && define.amd) define(factory);
    else root.drag = factory();
}(this, function() {

function drag(elem, cbs) {
    if(!elem) {
        console.warn('drag is missing elem!');
        return;
    }

    if(isTouch()) dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
    else dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
}
return drag;

// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function isTouch() {
    return typeof(window.ontouchstart) != 'undefined';
}

function dragTemplate(elem, cbs, down, move, up) {
    var dragging = false;

    cbs = getCbs(cbs);

    var beginCb = cbs.begin;
    var changeCb = cbs.change;
    var endCb = cbs.end;

    on(elem, down, function(e) {
        dragging = true;

        var moveHandler = partial(callCb, changeCb, elem);
        function upHandler() {
            dragging = false;

            off(document, move, moveHandler);
            off(document, up, upHandler);

            callCb(endCb, elem, e);
        }

        on(document, move, moveHandler);
        on(document, up, upHandler);

        callCb(beginCb, elem, e);
    });
    on(elem, up, function(e) {
        dragging = false;

        callCb(endCb, elem, e);
    });
}

function on(elem, evt, handler) {
    elem.addEventListener(evt, handler, false);
}

function off(elem, evt, handler) {
    elem.removeEventListener(evt, handler, false);
}

function getCbs(cbs) {
    if(!cbs) {
        var initialOffset;
        var initialPos;

        return {
            begin: function(c) {
                initialOffset = {x: c.elem.offsetLeft, y: c.elem.offsetTop};
                initialPos = c.cursor;
            },
            change: function(c) {
                style(c.elem, 'left', (initialOffset.x + c.cursor.x - initialPos.x) + 'px');
                style(c.elem, 'top', (initialOffset.y + c.cursor.y - initialPos.y) + 'px');
            },
            end: empty
        };
    }
    else {
        return {
            begin: cbs.begin || empty,
            change: cbs.change || empty,
            end: cbs.end || empty
        };
    }
}

// TODO: set draggable class (handy for fx)

function style(e, prop, value) {
    e.style[prop] = value;
}

function empty() {}

function callCb(cb, elem, e) {
    e.preventDefault();

    var offset = findPos(elem);
    var width = elem.clientWidth;
    var height = elem.clientHeight;
    var cursor = {
        x: cursorX(e),
        y: cursorY(e)
    };
    var x = (cursor.x - offset.x) / width;
    var y = (cursor.y - offset.y) / height;

    cb({
        x: isNaN(x)? 0: x,
        y: isNaN(y)? 0: y,
        cursor: cursor,
        elem: elem,
        e: e
    });
}

// http://stackoverflow.com/questions/4394747/javascript-curry-function
function partial(fn) {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments, [1]);

    return function() {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}

// http://www.quirksmode.org/js/findpos.html
function findPos(e) {
    var x = 0;
    var y = 0;

    if(e.offsetParent) {
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
        } while (e = e.offsetParent);
      }

    return {x: x, y: y}; 
}

// http://javascript.about.com/library/blmousepos.htm
function cursorX(evt) {
    if(evt.pageX) return evt.pageX;
    else if(evt.clientX)
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
}
function cursorY(evt) {
    if(evt.pageY) return evt.pageY;
    else if(evt.clientY)
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
}
}));

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        root.colorutils = factory();
    }
}(this, function() {
    var context = function(i, func) {
        func(i);
    };

    var isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    var isObject = function(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    };

    var isString = function(o) {
        return typeof(o) === 'string';
    };

    var lstrip = function(s, c) {
        var ret = '';
        var seeking = true;

        each(function(chr) {
            if(seeking) {
                if(chr != c) {
                    seeking = false;
                    ret += chr;
                }
            }
            else {
                ret += chr;
            }
        }, s);

        return ret;
    };

    var each = function(cb, o) {
        if(isArray(o) || isString(o)) {
            for(var i = 0, l = o.length; i < l; i++) {
                cb(o[i], i);
            }
        }

        if(isObject(o)) {
            var j = 0;

            for(var k in o) {
                cb(k, o[k], j);

                j++;
            }
        }
    };

    var map = function(cb, seq) {
        var ret;

        if(isArray(seq)) {
            ret = [];

            for(var i = 0, len = seq.length; i < len; i++) {
                ret.push(cb(seq[i], i));
            }
        }

        if(isObject(seq)) {
            ret = {};

            var j = 0; // XXX: enumerate
            for(var k in seq) {
                var v = seq[k];

                ret[k] = cb(k, v, j);
                j++;
            }
        }

        return ret;
    };

    var filter = function(cb, seq) {
        var ret;

        // TODO: array

        if(isObject(seq)) {
            ret = {};

            var j = 0; // XXX: enumerate
            for(var k in seq) {
                var v = seq[k];

                if(cb(k, v, j)) {
                    ret[k] = v;
                }

                j++;
            }
        }

        return ret;
    };

    // XXX: make work with args generally
    // XXX: make work with arrays too? 
    var extend = function(a, b) {
        var ret = {};

        var assign = function(k, v) {
            ret[k] = v;
        };

        each(assign, a);
        each(assign, b);

        return ret;
    };

    var toObject = function(zip) {
        // converts zip to an object
        var ret = {};

        each(function(k) {
            // XXX: this could fail!
            ret[k[0]] = k[1];
        }, zip);

        return ret;
    };

    var zip = function(a, b) {
        // XXX: might want to spec this better (min etc.)
        var ret = [];

        for(var i = 0; i < a.length; i++) {
            ret.push([a[i], b[i]]);
        }

        return ret;
    };

    var keys = function(o) {
        var ret = [];

        each(function(k) {
            ret.push(k);
        }, o);

        return ret;    
    };

    var values = function(o) {
        var ret = [];

        each(function(k, v) {
            ret.push(v);
        }, o);

        return ret;
    };

    var clamp = function(a, minValue, maxValue) {
        return Math.min(Math.max(a, minValue), maxValue);
    };

    var leftFill = function(number, width, chr)
    {
        // http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
        width -= number.toString().length;

        if(width > 0) {
            return new Array(width + (/\./.test(number)? 2: 1)).join(chr) + number;
        }

        return number;
    };

    return {
        context: context,
        isArray: isArray,
        isObject: isObject,
        isString: isString,
        lstrip: lstrip,
        each: each,
        map: map,
        filter: filter,
        extend: extend,
        toObject: toObject,
        zip: zip,
        keys: keys,
        values: values,
        clamp: clamp,
        leftFill: leftFill
    };
}));

(function(root, factory) {
    if(typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./colorutils'));
    }
    else if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./colorutils'], factory);
    }
    else {
        // Browser globals
        root.color = factory(root.colorutils);
    }
}(this, function(utils) {
    var nameToHex = function(name) {
        // based on http://www.phpied.com/rgb-color-parser-in-javascript/
        var colors = {
            aliceblue: 'f0f8ff',
            antiquewhite: 'faebd7',
            aqua: '00ffff',
            aquamarine: '7fffd4',
            azure: 'f0ffff',
            beige: 'f5f5dc',
            bisque: 'ffe4c4',
            black: '000000',
            blanchedalmond: 'ffebcd',
            blue: '0000ff',
            blueviolet: '8a2be2',
            brown: 'a52a2a',
            burlywood: 'deb887',
            cadetblue: '5f9ea0',
            chartreuse: '7fff00',
            chocolate: 'd2691e',
            coral: 'ff7f50',
            cornflowerblue: '6495ed',
            cornsilk: 'fff8dc',
            crimson: 'dc143c',
            cyan: '00ffff',
            darkblue: '00008b',
            darkcyan: '008b8b',
            darkgoldenrod: 'b8860b',
            darkgray: 'a9a9a9',
            darkgreen: '006400',
            darkkhaki: 'bdb76b',
            darkmagenta: '8b008b',
            darkolivegreen: '556b2f',
            darkorange: 'ff8c00',
            darkorchid: '9932cc',
            darkred: '8b0000',
            darksalmon: 'e9967a',
            darkseagreen: '8fbc8f',
            darkslateblue: '483d8b',
            darkslategray: '2f4f4f',
            darkturquoise: '00ced1',
            darkviolet: '9400d3',
            deeppink: 'ff1493',
            deepskyblue: '00bfff',
            dimgray: '696969',
            dodgerblue: '1e90ff',
            feldspar: 'd19275',
            firebrick: 'b22222',
            floralwhite: 'fffaf0',
            forestgreen: '228b22',
            fuchsia: 'ff00ff',
            gainsboro: 'dcdcdc',
            ghostwhite: 'f8f8ff',
            gold: 'ffd700',
            goldenrod: 'daa520',
            gray: '808080',
            green: '008000',
            greenyellow: 'adff2f',
            honeydew: 'f0fff0',
            hotpink: 'ff69b4',
            indianred : 'cd5c5c',
            indigo : '4b0082',
            ivory: 'fffff0',
            khaki: 'f0e68c',
            lavender: 'e6e6fa',
            lavenderblush: 'fff0f5',
            lawngreen: '7cfc00',
            lemonchiffon: 'fffacd',
            lightblue: 'add8e6',
            lightcoral: 'f08080',
            lightcyan: 'e0ffff',
            lightgoldenrodyellow: 'fafad2',
            lightgrey: 'd3d3d3',
            lightgreen: '90ee90',
            lightpink: 'ffb6c1',
            lightsalmon: 'ffa07a',
            lightseagreen: '20b2aa',
            lightskyblue: '87cefa',
            lightslateblue: '8470ff',
            lightslategray: '778899',
            lightsteelblue: 'b0c4de',
            lightyellow: 'ffffe0',
            lime: '00ff00',
            limegreen: '32cd32',
            linen: 'faf0e6',
            magenta: 'ff00ff',
            maroon: '800000',
            mediumaquamarine: '66cdaa',
            mediumblue: '0000cd',
            mediumorchid: 'ba55d3',
            mediumpurple: '9370d8',
            mediumseagreen: '3cb371',
            mediumslateblue: '7b68ee',
            mediumspringgreen: '00fa9a',
            mediumturquoise: '48d1cc',
            mediumvioletred: 'c71585',
            midnightblue: '191970',
            mintcream: 'f5fffa',
            mistyrose: 'ffe4e1',
            moccasin: 'ffe4b5',
            navajowhite: 'ffdead',
            navy: '000080',
            oldlace: 'fdf5e6',
            olive: '808000',
            olivedrab: '6b8e23',
            orange: 'ffa500',
            orangered: 'ff4500',
            orchid: 'da70d6',
            palegoldenrod: 'eee8aa',
            palegreen: '98fb98',
            paleturquoise: 'afeeee',
            palevioletred: 'd87093',
            papayawhip: 'ffefd5',
            peachpuff: 'ffdab9',
            peru: 'cd853f',
            pink: 'ffc0cb',
            plum: 'dda0dd',
            powderblue: 'b0e0e6',
            purple: '800080',
            red: 'ff0000',
            rosybrown: 'bc8f8f',
            royalblue: '4169e1',
            saddlebrown: '8b4513',
            salmon: 'fa8072',
            sandybrown: 'f4a460',
            seagreen: '2e8b57',
            seashell: 'fff5ee',
            sienna: 'a0522d',
            silver: 'c0c0c0',
            skyblue: '87ceeb',
            slateblue: '6a5acd',
            slategray: '708090',
            snow: 'fffafa',
            springgreen: '00ff7f',
            steelblue: '4682b4',
            tan: 'd2b48c',
            teal: '008080',
            thistle: 'd8bfd8',
            tomato: 'ff6347',
            turquoise: '40e0d0',
            violet: 'ee82ee',
            violetred: 'd02090',
            wheat: 'f5deb3',
            white: 'ffffff',
            whitesmoke: 'f5f5f5',
            yellow: 'ffff00',
            yellowgreen: '9acd32'
        };

        return name in colors? colors[name]: undefined;
    };

    var HEX_RGB = function(hex) {
        hex = utils.lstrip(hex, '#');

        // based on http://www.phpied.com/rgb-color-parser-in-javascript/
        return {
            r: parseInt(hex.substring(0, 2), 16) / 255 || 0,
            g: parseInt(hex.substring(2, 4), 16) / 255 || 0,
            b: parseInt(hex.substring(4, 6), 16) / 255 || 0
        };
    };

    var HEX_HSV = function(hex) {
        return RGB_HSV(HEX_RGB(hex));
    };

    var HEX_HSL = function(hex) {
        return RGB_HSL(HEX_RGB(hex));
    };

    var HSV_RGB = function(hsv) {
        // http://www.colorjack.com/opensource/dhtml+color+picker.html
        // h, s, v e [0, 1]
        var R, B, G, S = hsv.s, V = hsv.v, H = hsv.h;

        if(S > 0) {
            if(H >= 1) H=0;

            H = 6 * H; F = H - Math.floor(H);
            A = V * (1.0 - S);
            B = V * (1.0 - (S * F));
            C = V * (1.0 - (S * (1.0 - F)));

            switch(Math.floor(H)) {
                case 0: R = V; G = C; B = A; break;
                case 1: R = B; G = V; B = A; break;
                case 2: R = A; G = V; B = C; break;
                case 3: R = A; G = B; B = V; break;
                case 4: R = C; G = A; B = V; break;
                case 5: R = V; G = A; B = B; break;
            }

            return({
                r: R? R: 0,
                g: G? G: 0,
                b: B? B: 0
            });
        }
        
        return({
            r: V,
            g: V,
            b: V
        });
    };

    var hue_to_rgb = function(p, q, t) {
        // based on CamanJS
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;

        return p;
    };

    var HSL_RGB = function(hsl) {
        // based on CamanJS
        var r, g, b;
        var h = hsl.h;
        var s = hsl.s;
        var l = hsl.l;
  
        if(s === 0){
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue_to_rgb(p, q, h + 1/3);
            g = hue_to_rgb(p, q, h);
            b = hue_to_rgb(p, q, h - 1/3);
        }

        return {
            r: r,
            g: g,
            b: b
        };
    };

    var RGB_HSV = function(rgb) {
        // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        var r = rgb.r;
        var g = rgb.g;
        var b = rgb.b;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        } else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: h,
            s: s,
            v: v
        };
    };

    var RGB_HSL = function(rgb) {
        // based on CamanJS
        var r = rgb.r;
        var g = rgb.g;
        var b = rgb.b;

        var max = Math.max(r, g, b), min = Math.min(r, g, b), 
            h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {h: h, s: s, l: l};
    };

    var RGB_HEX = function(rgb) {
        // r, g, b e [0, 1]
        function toHex(n) {return utils.leftFill(Math.round(n * 255).toString(16), 2, 0);}

        return toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
    };

    var HSV_HEX = function(hsv) {
        return RGB_HEX(HSV_RGB(hsv));
    };

    var HSL_HEX = function(hsl) {
        return RGB_HEX(HSL_RGB(hsl));
    };

    var colorTemplate = function(initialChannels, converters) {
        var parse = function(initial) {
            if(utils.isString(initial)) {
                var hex = nameToHex(initial);

                if(!hex) {
                    hex = initial;
                }

                return converters.hexToColor(hex);
            }

            if(utils.isObject(initial)) {
                if('toHex' in initial) {
                    var ret = converters.hexToColor(initial.toHex());

                    ret.a = initial.a();

                    return ret;
                }

                return utils.filter(function(k) {
                    return k in initialChannels;
                }, initial);
            }

            return null;
        };

        return function(initial) {
            var channels = utils.extend(initialChannels, parse(initial));

            channels = utils.map(function(k, v) {
                return utils.clamp(v, 0, 1);
            }, channels);

            var channel = function(name) {
                return function(v) {
                    if(v) {
                        channels[name] = utils.clamp(v, 0, 1);

                        return methods;
                    }

                    return channels[name];
                };
            };

            var methods = {
                toArray: function() {
                    return utils.values(channels);
                },
                toCSS: function() {
                    var rgb = converters.colorToRGB(channels);
                    var r = parseInt(rgb.r * 255, 10);
                    var g = parseInt(rgb.g * 255, 10);
                    var b = parseInt(rgb.b * 255, 10);
                    var a = channels.a;

                    if(channels.a < 1) {
                        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                    }

                    return 'rgb(' + r + ',' + g + ',' + b + ')';
                },
                toRGBA: function() { // XXX: experimental
                    var rgba = converters.colorToRGB(channels);
                    rgba.a = channels.a;

                    return rgba;
                },
                toHex: function() {
                    return converters.colorToHex(channels);
                }
            };

            utils.each(function(k) {
                methods[k] = channel(k);
            }, utils.keys(channels));

            return methods;
        };
    };

    var rgba = colorTemplate({r: 0, g: 0, b: 0, a: 1}, {
        hexToColor: HEX_RGB,
        colorToRGB: function(a) {return a;},
        colorToHex: RGB_HEX
    });
    var hsva = colorTemplate({h: 0, s: 0, v: 0, a: 1}, {
        hexToColor: HEX_HSV,
        colorToRGB: HSV_RGB,
        colorToHex: HSV_HEX
    });
    var hsla = colorTemplate({h: 0, s: 0, l: 0, a: 1}, {
        hexToColor: HEX_HSL,
        colorToRGB: HSL_RGB,
        colorToHex: HSL_HEX
    });

    return {
        nameToHex: nameToHex,
        rgba: rgba,
        hsva: hsva,
        hsla: hsla
    };
}));

(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./color', './drag'], factory);
  else root.colorjoe = factory(root.color, root.drag);
}(this, function(color, drag) {
var ret = function(element, initialColor) {
  var picker = element;
  if(isString(element)) picker = document.getElementById(element);

  if(picker) return setup(picker, initialColor);

  function setup(picker, col) {
    var hsv = color.hsva(col);

    picker.className = 'colorPicker';

    var div = partial(e, 'div');
    var twod = div('twod', picker);
    var p1 = div('pointer', twod);
    div('shape shape1', p1);
    div('shape shape2', p1);
    div('bg bg1', twod);
    div('bg bg2', twod);

    var oned = div('oned', picker);
    var p2 = div('pointer', oned);
    div('shape', p2);
    div('bg', oned);

    drag(oned, {
      begin: changeH,
      change: changeH,
      end: done
    });

    function changeH(p) {
      hsv.h(p.y);
      H(p.y);
      changed(hsv);
    }

    drag(twod, {
      begin: changeSV,
      change: changeSV,
      end: done
    });

    function changeSV(p) {
      hsv.s(p.x);
      hsv.v(1 - p.y);
      SV(p.x, 1 - p.y);
      changed(hsv);
    }

    H(hsv.h());

    SV(hsv.s(), hsv.v());

    function H(h) {
      p2.style.top = clamp(h * 100, 0, 100) + '%';
      twod.style.background = color.hsva({h: h, s: 1, v: 1}).toCSS();
    }

    function SV(s, v) {
      p1.style.left = clamp(s * 100, 0, 100) + '%';
      p1.style.top = clamp((1 - v) * 100, 0, 100) + '%';
    }

    var listeners = {change: [], done: []};

    function changed() {
      for(var i = 0, len = listeners.change.length; i < len; i++)
        listeners.change[i](hsv);
    }

    function done() {
      for(var i = 0, len = listeners.done.length; i < len; i++)
        listeners.done[i](hsv);
    }

    var ob = {
      e: picker,
      update: function() {
        changed(hsv);

        return ob;
      },
      get: function() {
          return color.rgba(hsv);
      },
      set: function(c) {
        hsv = color.hsva(c);
        hsv.v(hsv.v());
        H(hsv.h());
        SV(hsv.s(), hsv.v());

        return ob;
      },
      on: function(evt, cb) {
        if(evt == 'change' || evt == 'done') {
          listeners[evt].push(cb);
        }
        else console.warn('Passed invalid evt name to colorjoe.on');

        return ob;
      },
      removeAllListeners: function(evt) {
        if (evt) {
          delete listeners[evt];
        }
        else {
          for(var key in listeners) {
            delete listeners[key];
          }
        }
      }
    };

    return ob;
  }
};

// helpers needed by rgbjoe
ret.partial = partial;
ret.e = e;

return ret;

function clamp(a, minValue, maxValue) {
  return Math.min(Math.max(a, minValue), maxValue);
}

function isString(o) {
  return typeof(o) === 'string';
}

function e(type, klass, p) {
  var elem = document.createElement(type);
  elem.className = klass;
  p.appendChild(elem);

  return elem;
}

// http://stackoverflow.com/questions/4394747/javascript-curry-function
function partial(fn) {
  var slice = Array.prototype.slice;
  var args = slice.apply(arguments, [1]);

  return function() {
    return fn.apply(null, args.concat(slice.apply(arguments)));
  };
}
}));

(function(root, factory) {
  if(typeof define === 'function' && define.amd) define(['./colorjoe', './color'], factory);
  else root.rgbjoe = factory(root.colorjoe, root.color);
}(this, function(colorjoe, color) {
return function(e, initialColor) {
  var joe = colorjoe(e, initialColor).on('change',
    function(c) {
      setBg(c);
      var rgba = color.rgba(c);
      r.input.value = Math.round(rgba.r() * 255);
      g.input.value = Math.round(rgba.g() * 255);
      b.input.value = Math.round(rgba.b() * 255);
      hex.input.value = c.toHex();
    }
  );

  var div = colorjoe.partial(colorjoe.e, 'div');

  var extras = div('extras', joe.e);
  var curColor = div('currentColor', extras);
  var rgb = div('rgb', extras);

  var r = labelInput('color r', 'R', rgb, 3); 
  r.input.onkeyup = updateJoe;

  var g = labelInput('color g', 'G', rgb, 3); 
  g.input.onkeyup = updateJoe;

  var b = labelInput('color b', 'B', rgb, 3); 
  b.input.onkeyup = updateJoe;

  var hex = labelInput('hex', '', extras, 6);
  hex.input.onkeyup = function(e) {
    var val = e.target.value;
    joe.set(val);

    var col = joe.get();
    setBg(col);

    var rgb = color.rgba(col);
    r.input.value = Math.round(rgb.r() * 255);
    g.input.value = Math.round(rgb.g() * 255);
    b.input.value = Math.round(rgb.b() * 255);
  };

  joe.update();

  function updateJoe(e) {
    var rgb = color.rgba({
      r: r.input.value / 255,
      g: g.input.value / 255,
      b: b.input.value / 255
    });
    joe.set(rgb);

    var col = joe.get();
    hex.input.value = col.toHex();
    setBg(col);
  }

  function setBg(c) {
    curColor.style.background = c.toCSS();
  }

  function labelInput(klass, n, p, maxLen) {
    var d = div(klass, p); 
    var l = label(n, d); 
    var i = input('text', d, maxLen);

    return {label: l, input: i}; 
  }

  function label(c, p) {
    var e = colorjoe.e('label', '', p);
    e.innerHTML = c;

    return e;
  }

  function input(t, p, maxLen) {
    var e = colorjoe.e('input', '', p);
    e.type = t;
    if(maxLen) e.maxLength = maxLen;

    return e;
  }

  return joe;
};
}));
