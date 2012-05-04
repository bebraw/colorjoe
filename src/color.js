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
