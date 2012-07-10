/*! colorjoe - v0.6.1 - 2012-07-10
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

function xyslider(o) {
    var twod = div(o['class'] || '', o.parent);
    var pointer = div('pointer', twod);
    div('shape shape1', pointer);
    div('shape shape2', pointer);
    div('bg bg1', twod);
    div('bg bg2', twod);

    drag(twod, attachPointer(o.cbs, pointer));

    return {
        background: twod,
        pointer: pointer
    };
}

function slider(o) {
    var oned = div(o['class'], o.parent);
    var pointer = div('pointer', oned);
    div('shape', pointer);
    div('bg', oned);

    drag(oned, attachPointer(o.cbs, pointer));

    return {
        background: oned,
        pointer: pointer
    };
}

drag.xyslider = xyslider;
drag.slider = slider;

return drag;

function attachPointer(cbs, pointer) {
    var ret = {};

    for(var n in cbs) ret[n] = wrap(cbs[n]);

    function wrap(fn) {
        return function(p) {
            p.pointer = pointer;
            fn(p);
        };
    }

    return ret;
}

// move to elemutils lib?
function div(klass, p) {
    return e('div', klass, p);
}

function e(type, klass, p) {
    var elem = document.createElement(type);
    if(klass) elem.className = klass;
    p.appendChild(elem);

    return elem;
}

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
    if(elem.addEventListener)
        elem.addEventListener(evt, handler, false);
    else if(elem.attachEvent)
        elem.attachEvent('on' + evt, handler);
}

function off(elem, evt, handler) {
    if(elem.removeEventListener)
        elem.removeEventListener(evt, handler, false);
    else if(elem.detachEvent)
        elem.detachEvent('on' + evt, handler);
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
        x: cursorX(elem, e),
        y: cursorY(elem, e)
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
function cursorX(elem, evt) {
    if(isFixed(elem)) {
        var bodyLeft = parseInt(document.defaultView.getComputedStyle(document.body, "").marginLeft, 10) - calc(elem, 'scrollLeft') + window.pageXOffset + elem.style.marginLeft;

        return evt.clientX - bodyLeft;
    }
    if(evt.pageX) return evt.pageX;
    else if(evt.clientX)
        return evt.clientX + document.body.scrollLeft;
}
function cursorY(elem, evt) {
    if(isFixed(elem)) {
        var bodyTop = parseInt(document.defaultView.getComputedStyle(document.body, "").marginTop, 10) - calc(elem, 'scrollTop') + window.pageYOffset + elem.style.marginTop;

        return evt.clientY - bodyTop;
    }
    if(evt.pageY) return evt.pageY;
    else if(evt.clientY)
        return evt.clientY + document.body.scrollTop;
}

function calc(element, prop) {
    var ret = 0;

    while (element.nodeName != "HTML") {
        ret += element[prop];
        element = element.parentNode;
    }

    return ret;
}

// http://www.velocityreviews.com/forums/t942580-mouse-position-in-both-fixed-and-relative-positioning.html
function isFixed(element) {
    // While not at the top of the document tree, or not fixed, keep
    // searching upwards.
    while (element.nodeName != "HTML" && usedStyle(element,
            "position") != "fixed")
        element = element.parentNode;
        if(element.nodeName == "HTML") return false;
        else return true;
}

// Used style is to get around browsers' different methods of getting
// the currently used (e.g. inline, class, etc) style for an element
function usedStyle(element, property) {
    var s;

    // getComputedStyle is the standard way but some ie versions don't
    // support it
    if(window.getComputedStyle)
        s = window.getComputedStyle(element, null);
    else s = element.currentStyle;

    return s[property];
}
}));

/*global define*/
var installedColorSpaces = [],
    namedColors = {},
    undef = function (obj) {
        return typeof obj === 'undefined';
    },
    channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
    alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
    cssColorRegExp = new RegExp(
                         "^(rgb|hsl|hsv)a?" +
                         "\\(" +
                             channelRegExp.source + "," +
                             channelRegExp.source + "," +
                             channelRegExp.source +
                             "(?:," + alphaChannelRegExp.source + ")?" +
                         "\\)$", "i");

function ONECOLOR (obj) {
    if (Object.prototype.toString.apply(obj) === '[object Array]') {
        if (obj.length === 4) {
            // Assumed 4 element int RGB array from canvas with all channels [0;255]
            return new ONECOLOR.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
        } else {
            // Assumed destringified array from one.color.JSON()
            return new ONECOLOR[obj[0]](obj.slice(1, obj.length));
        }
    } else if (typeof obj === 'string') {
        var lowerCased = obj.toLowerCase();
        if (namedColors[lowerCased]) {
            obj = '#' + namedColors[lowerCased];
        }
        // Test for CSS rgb(....) string
        var matchCssSyntax = obj.match(cssColorRegExp);
        if (matchCssSyntax) {
            var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                hasHue = colorSpaceName[0] === 'H',
                firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
            if (undef(ONECOLOR[colorSpaceName])) {
                throw new Error("one.color." + colorSpaceName + " is not installed.");
            }
            return new ONECOLOR[colorSpaceName](
                parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                alpha
            );
        }
        // Assume hex syntax
        if (obj.length < 6) {
            // Allow CSS shorthand
            obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
        }
        // Split obj into red, green, and blue components
        var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
        if (hexMatch) {
            return new ONECOLOR.RGB(
                parseInt(hexMatch[1], 16) / 255,
                parseInt(hexMatch[2], 16) / 255,
                parseInt(hexMatch[3], 16) / 255
            );
        }
    } else if (typeof obj === 'object' && obj.isColor) {
        return obj;
    } else if (!isNaN(obj)) {
        // Strange integer representation sometimes returned by document.queryCommandValue in some browser...
        return new ONECOLOR.RGB((obj & 0xFF) / 255, ((obj & 0xFF00) >> 8) / 255, ((obj & 0xFF0000) >> 16) / 255);
    }
    return false;
};

/*jslint evil:true*/
function installColorSpace(colorSpaceName, propertyNames, config) {
    ONECOLOR[colorSpaceName] = new Function(propertyNames.join(","),
        // Allow passing an array to the constructor:
        "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
            propertyNames.map(function (propertyName, i) {
                return propertyName + "=" + propertyNames[0] + "[" + i + "];";
            }).reverse().join("") +
        "}" +
        "if (" + propertyNames.filter(function (propertyName) {
            return propertyName !== 'alpha';
        }).map(function (propertyName) {
            return "isNaN(" + propertyName + ")";
        }).join("||") + "){" + "throw new Error(\"[" + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\");}" +
        propertyNames.map(function (propertyName) {
            if (propertyName === 'hue') {
                return "this._hue=hue<0?hue-Math.floor(hue):hue%1"; // Wrap
            } else if (propertyName === 'alpha') {
                return "this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);";
            } else {
                return "this._" + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
            }
        }).join(";") + ";"
    );
    ONECOLOR[colorSpaceName].propertyNames = propertyNames;

    var prototype = ONECOLOR[colorSpaceName].prototype;

    ['valueOf', 'hex', 'css', 'cssa'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : new Function("return this.rgb()." + methodName + "();"));
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (undef(epsilon)) {
            epsilon = 1e-10;
        }

        otherColor = otherColor[colorSpaceName.toLowerCase()]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = new Function(
        "return ['" + colorSpaceName + "', " +
            propertyNames.map(function (propertyName) {
                return "this._" + propertyName;
            }, this).join(", ") +
        "];"
    );

    for (var propertyName in config) {
        if (config.hasOwnProperty(propertyName)) {
            var matchFromColorSpace = propertyName.match(/^from(.*)$/);
            if (matchFromColorSpace) {
                ONECOLOR[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
            } else {
                prototype[propertyName] = config[propertyName];
            }
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype[colorSpaceName.toLowerCase()] = function () {
        return this;
    };
    prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
        return "\" " + propertyNames[i] + "=\"+this._" + propertyName;
    }).join("+") + "+\"]\";");

    // Generate getters and setters
    propertyNames.forEach(function (propertyName, i) {
        prototype[propertyName] = new Function("value", "isDelta",
            // Simple getter mode: color.red()
            "if (typeof value === 'undefined') {" +
                "return this._" + propertyName + ";" +
            "}" +
            // Adjuster: color.red(+.2, true)
            "if (isDelta) {" +
                "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                    return "this._" + otherPropertyName + (propertyName === otherPropertyName ? "+value" : "");
                }).join(", ") + ");" +
            "}" +
            // Setter: color.red(.2);
            "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                return propertyName === otherPropertyName ? "value" : "this._" + otherPropertyName;
            }).join(", ") + ");");
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj[sourceColorSpaceName.toLowerCase()] = new Function("return this.rgb()." + sourceColorSpaceName.toLowerCase() + "();"); // Fallback
        ONECOLOR[sourceColorSpaceName].propertyNames.forEach(function (propertyName, i) {
            obj[propertyName] = new Function("value", "isDelta", "return this." + sourceColorSpaceName.toLowerCase() + "()." + propertyName + "(value, isDelta);");
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && ONECOLOR[targetColorSpaceName].prototype[prop] === undefined) {
                ONECOLOR[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    installedColorSpaces.push(colorSpaceName);
};

ONECOLOR.installMethod = function (name, fn) {
    installedColorSpaces.forEach(function (colorSpace) {
        ONECOLOR[colorSpace].prototype[name] = fn;
    });
};

installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
    hex: function () {
        var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    css: function () {
        return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
    },

    cssa: function () {
        return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
    }
});

if (typeof module !== 'undefined') {
    // Node module export
    module.exports = ONECOLOR;
} else {
    // Browser
    if (typeof define === 'function' && !undef(define.amd)) {
        define([], function () {
            return ONECOLOR;
        });
    } else {
        one = window.one || {};
        one.color = ONECOLOR;
    }
}

/*global namedColors*/
namedColors = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '0ff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '00f',
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
    cyan: '0ff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgrey: 'a9a9a9',
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
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'f0f',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    grey: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
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
    lightgray: 'd3d3d3',
    lightgrey: 'd3d3d3',
    lightgreen: '90ee90',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
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
    red: 'f00',
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
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32'
};

/*global one*/

installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
    rgb: function () {
        var hue = this._hue,
            saturation = this._saturation,
            value = this._value,
            i = Math.min(5, Math.floor(hue * 6)),
            f = hue * 6 - i,
            p = value * (1 - saturation),
            q = value * (1 - f * saturation),
            t = value * (1 - (1 - f) * saturation),
            red,
            green,
            blue;
        switch (i) {
        case 0:
            red = value;
            green = t;
            blue = p;
            break;
        case 1:
            red = q;
            green = value;
            blue = p;
            break;
        case 2:
            red = p;
            green = value;
            blue = t;
            break;
        case 3:
            red = p;
            green = q;
            blue = value;
            break;
        case 4:
            red = t;
            green = p;
            blue = value;
            break;
        case 5:
            red = value;
            green = p;
            blue = q;
            break;
        }
        return new ONECOLOR.RGB(red, green, blue, this._alpha);
    },

    hsl: function () {
        var l = (2 - this._saturation) * this._value,
            sv = this._saturation * this._value,
            svDivisor = l <= 1 ? l : (2 - l),
            saturation;

        // Avoid division by zero when lightness approaches zero:
        if (svDivisor < 1e-9) {
            saturation = 0;
        } else {
            saturation = sv / svDivisor;
        }
        return new ONECOLOR.HSL(this._hue, saturation, l / 2, this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        var red = this._red,
            green = this._green,
            blue = this._blue,
            max = Math.max(red, green, blue),
            min = Math.min(red, green, blue),
            delta = max - min,
            hue,
            saturation = (max === 0) ? 0 : (delta / max),
            value = max;
        if (delta === 0) {
            hue = 0;
        } else {
            switch (max) {
            case red:
                hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                break;
            case green:
                hue = (blue - red) / delta / 6 + 1 / 3;
                break;
            case blue:
                hue = (red - green) / delta / 6 + 2 / 3;
                break;
            }
        }
        return new ONECOLOR.HSV(hue, saturation, value, this._alpha);
    }
});

/*global one*/


installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
    hsv: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var l = this._lightness * 2,
            s = this._saturation * ((l <= 1) ? l : 2 - l),
            saturation;

        // Avoid division by zero when l + s is very small (approaching black):
        if (l + s < 1e-9) {
            saturation = 0;
        } else {
            saturation = (2 * s) / (l + s);
        }

        return new ONECOLOR.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
    },

    rgb: function () {
        return this.hsv().rgb();
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        return this.hsv().hsl();
    }
});

/*global one*/

installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
    rgb: function () {
        return new ONECOLOR.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                 (1 - this._magenta * (1 - this._black) - this._black),
                                 (1 - this._yellow * (1 - this._black) - this._black),
                                 this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var red = this._red,
            green = this._green,
            blue = this._blue,
            cyan = 1 - red,
            magenta = 1 - green,
            yellow = 1 - blue,
            black = 1;
        if (red || green || blue) {
            black = Math.min(cyan, Math.min(magenta, yellow));
            cyan = (cyan - black) / (1 - black);
            magenta = (magenta - black) / (1 - black);
            yellow = (yellow - black) / (1 - black);
        } else {
            black = 1;
        }
        return new ONECOLOR.CMYK(cyan, magenta, yellow, black, this._alpha);
    }
});

ONECOLOR.installMethod('clearer', function (amount) {
    return this.alpha(isNaN(amount) ? -0.1 : -amount, true);
});


ONECOLOR.installMethod('darken', function (amount) {
    return this.lightness(isNaN(amount) ? -0.1 : -amount, true);
});


ONECOLOR.installMethod('saturate', function (amount) {
    return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
});

function gs () {
    var rgb = this.rgb(),
        val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

    return new ONECOLOR.RGB(val, val, val, this._alpha);
};

ONECOLOR.installMethod('greyscale', gs);
ONECOLOR.installMethod('grayscale', gs);


ONECOLOR.installMethod('lighten', function (amount) {
    return this.lightness(isNaN(amount) ? 0.1 : amount, true);
});

ONECOLOR.installMethod('mix', function (otherColor, weight) {
    otherColor = ONECOLOR(otherColor).rgb();
    weight = 1 - (weight || 0.5);

    var w = weight * 2 - 1,
        a = this._alpha - otherColor._alpha,
        weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
        weight2 = 1 - weight1,
        rgb = this.rgb();

    return new ONECOLOR.RGB(
        this._red * weight1 + otherColor._red * weight2,
        this._green * weight1 + otherColor._green * weight2,
        this._blue * weight1 + otherColor._blue * weight2,
        this._alpha * weight + otherColor._alpha * (1 - weight)
    );
});

ONECOLOR.installMethod('negate', function () {
    var rgb = this.rgb();
    return new ONECOLOR.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
});

ONECOLOR.installMethod('opaquer', function (amount) {
    return this.alpha(isNaN(amount) ? 0.1 : amount, true);
});

ONECOLOR.installMethod('rotate', function (degrees) {
    return this.hue((degrees || 0) / 360, true);
});


ONECOLOR.installMethod('saturate', function (amount) {
    return this.saturation(isNaN(amount) ? 0.1 : amount, true);
});

// Adapted from http://gimp.sourcearchive.com/documentation/2.6.6-1ubuntu1/color-to-alpha_8c-source.html
/*
    toAlpha returns a color where the values of the argument have been converted to alpha
*/
ONECOLOR.installMethod('toAlpha', function (color) {
    var me = this.rgb(),
        other = ONECOLOR(color).rgb(),
        epsilon = 1e-10,
        a = new ONECOLOR.RGB(0, 0, 0, me._alpha),
        channels = ['_red', '_green', '_blue'];

    channels.forEach(function (channel) {
        if (me[channel] < epsilon) {
            a[channel] = me[channel];
        } else if (me[channel] > other[channel]) {
            a[channel] = (me[channel] - other[channel]) / (1 - other[channel]);
        } else if (me[channel] > other[channel]) {
            a[channel] = (other[channel] - me[channel]) / other[channel];
        } else {
            a[channel] = 0;
        }
    });

    if (a._red > a._green) {
        if (a._red > a._blue) {
            me._alpha = a._red;
        } else {
            me._alpha = a._blue;
        }
    } else if (a._green > a._blue) {
        me._alpha = a._green;
    } else {
        me._alpha = a._blue;
    }

    if (me._alpha < epsilon) {
        return me;
    }

    channels.forEach(function (channel) {
        me[channel] = (me[channel] - other[channel]) / me._alpha + other[channel];
    });
    me._alpha *= a._alpha;

    return me;
});

/*global one*/

// This file is purely for the build system

// Convenience functions


(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        root.elemutils = factory();
    }
}(this, function() {
    var div = partial(e, 'div');

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

    function labelInput(klass, n, p, maxLen) {
        var d = div(klass, p);
        var l = label(n, d);
        var i = input('text', d, maxLen);

        return {label: l, input: i};
    }

    function label(c, p) {
        var elem = e('label', '', p);
        elem.innerHTML = c;

        return elem;
    }

    function input(t, p, maxLen) {
        var elem = e('input', '', p);
        elem.type = t;
        if(maxLen) elem.maxLength = maxLen;

        return elem;
    }

    function X(p, a) {p.style.left = clamp(a * 100, 0, 100) + '%';}
    function Y(p, a) {p.style.top = clamp(a * 100, 0, 100) + '%';}
    function BG(e, c) {e.style.background = c;}

    function clamp(a, minValue, maxValue) {
        return Math.min(Math.max(a, minValue), maxValue);
    }

    return {
        clamp: clamp,
        e: e,
        div: div,
        partial: partial,
        labelInput: labelInput,
        X: X,
        Y: Y,
        BG: BG
    };
}));

(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./onecolor', './elemutils'], factory);
  else root.colorjoeextras = factory(root.ONECOLOR, root.elemutils);
}(this, function(onecolor, utils) {
function currentColor(p) {
  var e = utils.div('currentColor', p);

  return {
    change: function(col) {
      utils.BG(e, col.cssa());
    }
  };
}

function fields(cs, fac, fix) {
  fac = fac || 255;
  fix = fix >= 0? fix: 2;
  var methods = {
    R: 'red',
    G: 'green',
    B: 'blue',
    H: 'hue',
    S: 'saturation',
    V: 'value',
    L: 'lightness',
    C: 'cyan',
    M: 'magenta',
    Y: 'yellow',
    K: 'black'
  };
  var inputLen = ('' + fac).length + fix;
  inputLen = fix? inputLen + 1: inputLen;
  var chg = false; // XXX

  var initials = cs.split('').map(function(n) {return n.toUpperCase();});

  if(['RGB', 'HSL', 'HSV', 'CMYK'].indexOf(cs) < 0)
    return console.warn('Invalid field names', cs);

  return function(p, joe) {
    var c = utils.div('colorFields', p);
    var elems = initials.map(function(n, i) {
      var e = utils.labelInput('color ' + methods[n], n, c, inputLen);
      e.input.onkeyup = update;

      return {name: n, e: e};
    });

    function update() {
      var col = [cs];

      elems.forEach(function(o) {col.push(o.e.input.value / fac);});

      chg = true;
      joe.set(onecolor(col));
    }

    return {
      change: function(col) {
        if(!chg)
          elems.forEach(function(o) {
            o.e.input.value = (col[methods[o.name]]() * fac).toFixed(fix);
          });
        chg = false;
      }
    };
  };
}

function hex(p, joe) {
  var e = utils.labelInput('hex', '', p, 6);
  var chg = false; // XXX

  e.input.onkeyup = function(elem) {
    chg = true;
    joe.set('#' + pad(elem.target.value, 6, '0'));
  };

  return {
    change: function(col) {
      if(!chg) e.input.value = col.hex().slice(1);
      chg = false;
    }
  };
}

function pad(a, n, c) {
  var ret = a;

  for(var i = a.length, len = n; i < n; i++) ret += c;

  return ret;
}

return {
  currentColor: currentColor,
  fields: fields,
  hex: hex
};
}));

(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./onecolor', './drag', './elemutils', './extras'], factory);
  else root.colorjoe = factory(root.ONECOLOR, root.drag, root.elemutils,
    root.colorjoeextras);
}(this, function(onecolor, drag, utils, extras) {
var picker = function(cbs) {
  if(!all(isFunction, [cbs.init, cbs.xy, cbs.z]))
    return console.warn('colorjoe: missing cb');

  return function(element, initialColor, extras) {
    return setup({
      e: element,
      color: initialColor,
      cbs: cbs,
      extras: extras
    });
  };
};

/* pickers */
picker.rgb = picker({
  init: function(col, xy, z) {
    var ret = onecolor(col).hsl();

    this.xy(ret, {x: ret.saturation(), y: 1 - ret.value()}, xy, z);
    this.z(ret, ret.hue(), xy, z);

    return ret;
  },
  xy: function(col, p, xy, z) {
    utils.X(xy.pointer, p.x);
    utils.Y(xy.pointer, p.y);

    return col.saturation(p.x).value(1 - p.y);
  },
  z: function(col, v, xy, z) {
    utils.Y(z.pointer, v);
    RGB_BG(xy.background, v);

    return col.hue(v);
  }
});

picker.hsl = picker({
  init: function(col, xy, z) {
    var ret = onecolor(col).hsl();

    this.xy(ret, {x: ret.hue(), y: 1 - ret.saturation()}, xy, z);
    this.z(ret, 1 - ret.lightness(), xy, z);

    return ret;
  },
  xy: function(col, p, xy, z) {
    utils.X(xy.pointer, p.x);
    utils.Y(xy.pointer, p.y);
    RGB_BG(z.background, p.x);

    return col.hue(p.x).saturation(1 - p.y);
  },
  z: function(col, v, xy, z) {
    utils.Y(z.pointer, v);

    return col.lightness(1 - v);
  }
});

picker.extras = extras;

return picker;

function RGB_BG(e, h) {utils.BG(e, new onecolor.HSV(h, 1, 1).cssa());}

function setup(o) {
  if(!o.e) return console.warn('colorjoe: missing element');

  var e = isString(o.e)? document.getElementById(o.e): o.e;
  e.className = 'colorPicker';

  var cbs = o.cbs;

  var xy = drag.xyslider({
    parent: e,
    'class': 'twod',
    cbs: {
      begin: changeXY,
      change: changeXY,
      end: done
    }
  });

  function changeXY(p) {
    col = cbs.xy(col, {
      x: utils.clamp(p.x, 0, 1),
      y: utils.clamp(p.y, 0, 1)
    }, xy, z);
    changed();
  }

  var z = drag.slider({
    parent: e,
    'class': 'oned',
    cbs: {
      begin: changeZ,
      change: changeZ,
      end: done
    }
  });

  function changeZ(p) {
    col = cbs.z(col, utils.clamp(p.y, 0, 1), xy, z);
    changed();
  }

  var col = cbs.init(getColor(o.color), xy, z);
  var listeners = {change: [], done: []};

  function changed() {
    for(var i = 0, len = listeners.change.length; i < len; i++)
      listeners.change[i](col);
  }

  function done() {
    for(var i = 0, len = listeners.done.length; i < len; i++)
      listeners.done[i](col);
  }

  var ob = {
    e: e,
    update: function() {
      changed();

      return ob;
    },
    get: function() {
      return col;
    },
    set: function(c) {
      var oldCol = this.get();
      col = cbs.init(getColor(c), xy, z);

      if(oldCol.hex() != col.hex()) changed();

      return ob;
    },
    on: function(evt, cb) {
      if(evt == 'change' || evt == 'done') {
        listeners[evt].push(cb);
      }
      else console.warn('Passed invalid evt name "' + evt + '" to colorjoe.on');

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

  setupExtras(e, ob, o.extras);
  changed();

  return ob;
}

function getColor(c) {
   var ret = onecolor(c);

   if(ret) return ret;

   if(isDefined(c)) console.warn('Passed invalid color to colorjoe, using black instead');

   return onecolor('black');
}

function setupExtras(p, joe, extras) {
  if(!extras) return;

  var c = utils.div('extras', p);
  var cbs;

  extras.forEach(function(e) {
    cbs = e(c, joe);

    for(var k in cbs) joe.on(k, cbs[k]);
  });
}

function all(cb, a) {return a.map(cb).filter(id).length == a.length;}

function isString(o) {return typeof(o) === 'string';}
function isDefined(input) {return typeof input !== "undefined";}
function isFunction(input) {return typeof input === "function";}
function id(a) {return a;}
}));
