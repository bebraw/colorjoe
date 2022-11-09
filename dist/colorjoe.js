/*! colorjoe - v4.2.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/colorjoe - 2022-11-09 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.colorjoe = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var dragjs_umd = createCommonjsModule(function (module, exports) {
	(function (root, factory) {

	        {
	            module.exports = factory();
	        }

	    }(commonjsGlobal, function () {

	        /*! dragjs - v0.8.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
	https://bebraw.github.com/dragjs - 2018-07-03 */
	var drag = (function() {
	    function drag(elem, cbs) {
	        if(!elem) {
	            console.warn('drag is missing elem!');
	            return;
	        }

	        dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
	        dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
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

	        for(var n in cbs) {
	          ret[n] = wrap(cbs[n]);
	        }

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
	        if(klass) {
	          elem.className = klass;
	        }
	        p.appendChild(elem);

	        return elem;
	    }

	    function dragTemplate(elem, cbs, down, move, up) {

	        cbs = getCbs(cbs);

	        var beginCb = cbs.begin;
	        var changeCb = cbs.change;
	        var endCb = cbs.end;

	        on(elem, down, function(e) {

	            var moveHandler = partial(callCb, changeCb, elem);
	            function upHandler() {

	                off(document, move, moveHandler);
	                off(document, up, upHandler);

	                callCb(endCb, elem, e);
	            }

	            on(document, move, moveHandler);
	            on(document, up, upHandler);

	            callCb(beginCb, elem, e);
	        });
	    }

	    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
	    function on(elem, evt, handler) {
	        // Test via a getter in the options object to see if the passive property is accessed
	        var supportsPassive = false;
	        try {
	        var opts = Object.defineProperty({}, 'passive', {
	            get: function() {
	            supportsPassive = true;
	            }
	        });
	        window.addEventListener("testPassive", null, opts);
	        window.removeEventListener("testPassive", null, opts);
	        } catch (e) {}

	        elem.addEventListener(evt, handler, supportsPassive ? { passive: false } : false);
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
	        var r = e.getBoundingClientRect();

	        return {
	            x: r.left,
	            y: r.top
	        };
	    }

	    // http://javascript.about.com/library/blmousepos.htm
	    function cursorX(elem, evt) {
	        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
	        return evtPos.clientX;
	    }
	    function cursorY(elem, evt) {
	        var evtPos = evt.touches ? evt.touches[evt.touches.length -1] : evt;
	        return evtPos.clientY;
	    }
	})();
	        return drag;

	    }));
	});

	var oneColorAll = createCommonjsModule(function (module, exports) {
	!function(e,a){module.exports=a();}(commonjsGlobal,function(){function e(a){if(Array.isArray(a)){if("string"==typeof a[0]&&"function"==typeof e[a[0]])return new e[a[0]](a.slice(1,a.length));if(4===a.length)return new e.RGB(a[0]/255,a[1]/255,a[2]/255,a[3]/255)}else if("string"==typeof a){var r=a.toLowerCase();e.namedColors[r]&&(a="#"+e.namedColors[r]),"transparent"===r&&(a="rgba(0,0,0,0)");var o=a.match(i);if(o){var s=o[1].toUpperCase(),f=t(o[8])?o[8]:parseFloat(o[8]),u="H"===s[0],l=o[3]?100:u?360:255,h=o[5]||u?100:255,c=o[7]||u?100:255;if(t(e[s]))throw new Error("color."+s+" is not installed.");return new e[s](parseFloat(o[2])/l,parseFloat(o[4])/h,parseFloat(o[6])/c,f)}a.length<6&&(a=a.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var d=a.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(d)return new e.RGB(parseInt(d[1],16)/255,parseInt(d[2],16)/255,parseInt(d[3],16)/255);if(e.CMYK){var b=a.match(new RegExp("^cmyk\\("+n.source+","+n.source+","+n.source+","+n.source+"\\)$","i"));if(b)return new e.CMYK(parseFloat(b[1])/100,parseFloat(b[2])/100,parseFloat(b[3])/100,parseFloat(b[4])/100)}}else if("object"==typeof a&&a.isColor)return a;return !1}var a=[],t=function(e){return void 0===e},r=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,n=/\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/,i=new RegExp("^(rgb|hsl|hsv)a?\\("+r.source+","+r.source+","+r.source+"(?:,"+/\s*(\.\d+|\d+(?:\.\d+)?)\s*/.source+")?\\)$","i");e.namedColors={},e.installColorSpace=function(r,n,i){function o(a,t){var r={};r[t.toLowerCase()]=function(){return this.rgb()[t.toLowerCase()]()},e[t].propertyNames.forEach(function(e){var a="black"===e?"k":e.charAt(0);r[e]=r[a]=function(a,r){return this[t.toLowerCase()]()[e](a,r)};});for(var n in r)r.hasOwnProperty(n)&&void 0===e[a].prototype[n]&&(e[a].prototype[n]=r[n]);}e[r]=function(e){var a=Array.isArray(e)?e:arguments;n.forEach(function(e,t){var i=a[t];if("alpha"===e)this._alpha=isNaN(i)||i>1?1:i<0?0:i;else{if(isNaN(i))throw new Error("["+r+"]: Invalid color: ("+n.join(",")+")");"hue"===e?this._hue=i<0?i-Math.floor(i):i%1:this["_"+e]=i<0?0:i>1?1:i;}},this);},e[r].propertyNames=n;var s=e[r].prototype;["valueOf","hex","hexa","css","cssa"].forEach(function(e){s[e]=s[e]||("RGB"===r?s.hex:function(){return this.rgb()[e]()});}),s.isColor=!0,s.equals=function(e,a){t(a)&&(a=1e-10),e=e[r.toLowerCase()]();for(var i=0;i<n.length;i+=1)if(Math.abs(this["_"+n[i]]-e["_"+n[i]])>a)return !1;return !0},s.toJSON=function(){return [r].concat(n.map(function(e){return this["_"+e]},this))};for(var f in i)if(i.hasOwnProperty(f)){var u=f.match(/^from(.*)$/);u?e[u[1].toUpperCase()].prototype[r.toLowerCase()]=i[f]:s[f]=i[f];}return s[r.toLowerCase()]=function(){return this},s.toString=function(){return "["+r+" "+n.map(function(e){return this["_"+e]},this).join(", ")+"]"},n.forEach(function(e){var a="black"===e?"k":e.charAt(0);s[e]=s[a]=function(a,t){return void 0===a?this["_"+e]:t?new this.constructor(n.map(function(t){return this["_"+t]+(e===t?a:0)},this)):new this.constructor(n.map(function(t){return e===t?a:this["_"+t]},this))};}),a.forEach(function(e){o(r,e),o(e,r);}),a.push(r),e},e.pluginList=[],e.use=function(a){return -1===e.pluginList.indexOf(a)&&(this.pluginList.push(a),a(e)),e},e.installMethod=function(t,r){return a.forEach(function(a){e[a].prototype[t]=r;}),this},e.installColorSpace("RGB",["red","green","blue","alpha"],{hex:function(){var e=(65536*Math.round(255*this._red)+256*Math.round(255*this._green)+Math.round(255*this._blue)).toString(16);return "#"+"00000".substr(0,6-e.length)+e},hexa:function(){var e=Math.round(255*this._alpha).toString(16);return "#"+"00".substr(0,2-e.length)+e+this.hex().substr(1,6)},css:function(){return "rgb("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+")"},cssa:function(){return "rgba("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+","+this._alpha+")"}});var o=e,s=function(e){e.installColorSpace("XYZ",["x","y","z","alpha"],{fromRgb:function(){var a=function(e){return e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92},t=a(this._red),r=a(this._green),n=a(this._blue);return new e.XYZ(.4124564*t+.3575761*r+.1804375*n,.2126729*t+.7151522*r+.072175*n,.0193339*t+.119192*r+.9503041*n,this._alpha)},rgb:function(){var a=this._x,t=this._y,r=this._z,n=function(e){return e>.0031308?1.055*Math.pow(e,1/2.4)-.055:12.92*e};return new e.RGB(n(3.2404542*a+-1.5371385*t+-.4985314*r),n(-.969266*a+1.8760108*t+.041556*r),n(.0556434*a+-.2040259*t+1.0572252*r),this._alpha)},lab:function(){var a=function(e){return e>.008856?Math.pow(e,1/3):7.787037*e+4/29},t=a(this._x/95.047),r=a(this._y/100),n=a(this._z/108.883);return new e.LAB(116*r-16,500*(t-r),200*(r-n),this._alpha)}});},f=function(e){e.use(s),e.installColorSpace("LAB",["l","a","b","alpha"],{fromRgb:function(){return this.xyz().lab()},rgb:function(){return this.xyz().rgb()},xyz:function(){var a=function(e){var a=Math.pow(e,3);return a>.008856?a:(e-16/116)/7.87},t=(this._l+16)/116,r=this._a/500+t,n=t-this._b/200;return new e.XYZ(95.047*a(r),100*a(t),108.883*a(n),this._alpha)}});},u=function(e){e.installColorSpace("HSV",["hue","saturation","value","alpha"],{rgb:function(){var a,t,r,n=this._hue,i=this._saturation,o=this._value,s=Math.min(5,Math.floor(6*n)),f=6*n-s,u=o*(1-i),l=o*(1-f*i),h=o*(1-(1-f)*i);switch(s){case 0:a=o,t=h,r=u;break;case 1:a=l,t=o,r=u;break;case 2:a=u,t=o,r=h;break;case 3:a=u,t=l,r=o;break;case 4:a=h,t=u,r=o;break;case 5:a=o,t=u,r=l;}return new e.RGB(a,t,r,this._alpha)},hsl:function(){var a,t=(2-this._saturation)*this._value,r=this._saturation*this._value,n=t<=1?t:2-t;return a=n<1e-9?0:r/n,new e.HSL(this._hue,a,t/2,this._alpha)},fromRgb:function(){var a,t=this._red,r=this._green,n=this._blue,i=Math.max(t,r,n),o=Math.min(t,r,n),s=i-o,f=0===i?0:s/i,u=i;if(0===s)a=0;else switch(i){case t:a=(r-n)/s/6+(r<n?1:0);break;case r:a=(n-t)/s/6+1/3;break;case n:a=(t-r)/s/6+2/3;}return new e.HSV(a,f,u,this._alpha)}});},l=function(e){e.use(u),e.installColorSpace("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var a,t=2*this._lightness,r=this._saturation*(t<=1?t:2-t);return a=t+r<1e-9?0:2*r/(t+r),new e.HSV(this._hue,a,(t+r)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}});},h=function(e){e.installColorSpace("CMYK",["cyan","magenta","yellow","black","alpha"],{rgb:function(){return new e.RGB(1-this._cyan*(1-this._black)-this._black,1-this._magenta*(1-this._black)-this._black,1-this._yellow*(1-this._black)-this._black,this._alpha)},fromRgb:function(){var a=this._red,t=this._green,r=this._blue,n=1-a,i=1-t,o=1-r,s=1;return a||t||r?(s=Math.min(n,Math.min(i,o)),n=(n-s)/(1-s),i=(i-s)/(1-s),o=(o-s)/(1-s)):s=1,new e.CMYK(n,i,o,s,this._alpha)}});},c=function(e){e.namedColors={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgrey:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",grey:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};},d=function(e){e.installMethod("clearer",function(e){return this.alpha(isNaN(e)?-.1:-e,!0)});},b=function(e){e.use(l),e.installMethod("darken",function(e){return this.lightness(isNaN(e)?-.1:-e,!0)});},p=function(e){e.use(l),e.installMethod("desaturate",function(e){return this.saturation(isNaN(e)?-.1:-e,!0)});},g=function(e){function a(){var a=this.rgb(),t=.3*a._red+.59*a._green+.11*a._blue;return new e.RGB(t,t,t,a._alpha)}e.installMethod("greyscale",a).installMethod("grayscale",a);},_=function(e){e.use(l),e.installMethod("lighten",function(e){return this.lightness(isNaN(e)?.1:e,!0)});},m=function(e){e.installMethod("mix",function(a,t){a=e(a).rgb(),t=1-(isNaN(t)?.5:t);var r=2*t-1,n=this._alpha-a._alpha,i=((r*n==-1?r:(r+n)/(1+r*n))+1)/2,o=1-i,s=this.rgb();return new e.RGB(s._red*i+a._red*o,s._green*i+a._green*o,s._blue*i+a._blue*o,s._alpha*t+a._alpha*(1-t))});},w=function(e){e.installMethod("negate",function(){var a=this.rgb();return new e.RGB(1-a._red,1-a._green,1-a._blue,this._alpha)});},y=function(e){e.installMethod("opaquer",function(e){return this.alpha(isNaN(e)?.1:e,!0)});},v=function(e){e.use(l),e.installMethod("rotate",function(e){return this.hue((e||0)/360,!0)});},k=function(e){e.use(l),e.installMethod("saturate",function(e){return this.saturation(isNaN(e)?.1:e,!0)});},M=function(e){e.installMethod("toAlpha",function(e){var a=this.rgb(),t=e(e).rgb(),r=new e.RGB(0,0,0,a._alpha),n=["_red","_green","_blue"];return n.forEach(function(e){a[e]<1e-10?r[e]=a[e]:a[e]>t[e]?r[e]=(a[e]-t[e])/(1-t[e]):a[e]>t[e]?r[e]=(t[e]-a[e])/t[e]:r[e]=0;}),r._red>r._green?r._red>r._blue?a._alpha=r._red:a._alpha=r._blue:r._green>r._blue?a._alpha=r._green:a._alpha=r._blue,a._alpha<1e-10?a:(n.forEach(function(e){a[e]=(a[e]-t[e])/a._alpha+t[e];}),a._alpha*=r._alpha,a)});};return o.use(s).use(f).use(u).use(l).use(h).use(c).use(d).use(b).use(p).use(g).use(_).use(m).use(w).use(y).use(v).use(k).use(M)});

	});

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
	    var id = "colorPickerInput" + Math.floor(Math.random() * 1001);
	    var d = div(klass, p);
	    var l = label(n, d, id);
	    var i = input('text', d, maxLen, id);

	    return {
	        label: l, 
	        input: i
	    };
	}

	function label(c, p, id) {
	    var elem = e('label', '', p);
	    elem.innerHTML = c;

	    if (id) {
	        elem.setAttribute('for', id);
	    }

	    return elem;
	}

	function input(t, p, maxLen, id) {
	    var elem = e('input', '', p);
	    elem.type = t;

	    if(maxLen) { 
	        elem.maxLength = maxLen;
	    }

	    if (id) {
	        elem.setAttribute('id', id);
	    }

	    if(maxLen) {
	        elem.maxLength = maxLen;
	    }

	    return elem;
	}

	function X(p, a) {
	    p.style.left = clamp(a * 100, 0, 100) + '%';
	}
	function Y(p, a) {
	    p.style.top = clamp(a * 100, 0, 100) + '%';
	}
	function BG(e, c) {
	    e.style.background = c;
	}

	function clamp(a, minValue, maxValue) {
	    return Math.min(Math.max(a, minValue), maxValue);
	}

	var utils = {
	    clamp: clamp,
	    e: e,
	    div: div,
	    partial: partial,
	    labelInput: labelInput,
	    X: X,
	    Y: Y,
	    BG: BG
	};

	function currentColor(p) {
	    var e1 = utils.div('currentColorContainer', p);
	    var e = utils.div('currentColor', e1);

	    return {
	        change: function(col) {
	            utils.BG(e, col.cssa());
	        }
	    };
	}

	function fields(p, joe, o) {
	    var cs = o.space;
	    var fac = o.limit || 255;
	    var fix = o.fix >= 0? o.fix: 0;
	    var inputLen = ('' + fac).length + fix;
	    inputLen = fix? inputLen + 1: inputLen;

	    var initials = cs.split('');
	    var useAlpha = cs[cs.length - 1] == 'A';
	    cs = useAlpha? cs.slice(0, -1): cs;

	    if(['RGB', 'HSL', 'HSV', 'CMYK'].indexOf(cs) < 0) {
	        return console.warn('Invalid field names', cs);
	    }

	    var c = utils.div('colorFields', p);
	    var elems = initials.map(function(n) {
	        n = n.toLowerCase();

	        var e = utils.labelInput('color ' + n, n, c, inputLen);
	        e.input.onblur = done;
	        e.input.onkeydown = validate;
	        e.input.onkeyup = update;

	        return {
	            name: n, 
	            e: e
	        };
	    });

	    function done() {
	        joe.done();
	    }

	    function validate(e) {
	        if (!(e.ctrlKey || e.altKey) && /^[a-zA-Z]$/.test(e.key)) {
	            e.preventDefault();
	        }
	    }

	    function update() {
	        var col = [cs];

	        elems.forEach(function(o) {col.push(o.e.input.value / fac);});

	        if(!useAlpha) {
	            col.push(joe.getAlpha());
	        }

	        joe.set(col);
	    }

	    return {
	        change: function(col) {
	            elems.forEach(function(o) {
	                o.e.input.value = (col[o.name]() * fac).toFixed(fix);
	            });
	        }
	    };
	}

	function alpha(p, joe) {
	    var e = dragjs_umd.slider({
	        parent: p,
	        'class': 'oned alpha',
	        cbs: {
	            begin: change,
	            change: change,
	            end: done
	        }
	    });

	    function done() {
	        joe.done();
	    }

	    function change(p) {
	        var val = utils.clamp(p.y, 0, 1);

	        utils.Y(p.pointer, val);
	        joe.setAlpha(1 - val);
	    }

	    return {
	        change: function(col) {
	            utils.Y(e.pointer, 1 - col.alpha());
	        }
	    };
	}

	function hex(p, joe, o) {
	    var e = utils.labelInput('hex', o.label || '', p, 7);
	    e.input.value = '#';

	    e.input.onkeyup = function(elem) {
	        var key = elem.keyCode || elem.which;
	        var val = elem.target.value;
	        val = val[0] == '#'? val: '#' + val;
	        val = pad(val, 7, '0');

	        if(key == 13) {
	            joe.set(val);
	        }
	    };

	    e.input.onblur = function(elem) {
	        joe.set(elem.target.value);
	        joe.done();
	    };

	    return {
	        change: function(col) {
	            e.input.value = e.input.value[0] == '#'? '#': '';
	            e.input.value += col.hex().slice(1);
	        }
	    };
	}

	function close(p, joe, o) {
	    var elem = utils.e('a', o['class'] || 'close', p);
	    elem.href = '#';
	    elem.innerHTML = o.label || 'Close';

	    elem.onclick = function(e) {
	        e.preventDefault();

	        joe.hide();
	    };
	}

	function pad(a, n, c) {
	    var ret = a;

	    for(var i = a.length; i < n; i++) {
	        ret += c;
	    }

	    return ret;
	}

	var extras = {
	    currentColor: currentColor,
	    fields: fields,
	    hex: hex,
	    alpha: alpha,
	    close: close
	};

	// Use the all build with cmyk and everything



	var colorjoe = function(cbs) {
	    if (!all(isFunction, [cbs.init, cbs.xy, cbs.z])) {
	        return console.warn("colorjoe: missing cb");
	    }

	    return function(element, initialColor, extras$$1) {
	        return setup({
	            e: element,
	            color: initialColor,
	            cbs: cbs,
	            extras: extras$$1,
	        });
	    };
	};

	/* pickers */
	colorjoe.rgb = colorjoe({
	    init: function(col, xy, z) {
	        var ret = oneColorAll(col).hsv();

	        this.xy(ret, { x: ret.saturation(), y: 1 - ret.value() }, xy, z);
	        this.z(ret, ret.hue(), xy, z);

	        return ret;
	    },
	    xy: function(col, p, xy) {
	        utils.X(xy.pointer, p.x);
	        utils.Y(xy.pointer, p.y);

	        return col.saturation(p.x).value(1 - p.y);
	    },
	    z: function(col, v, xy, z) {
	        utils.Y(z.pointer, v);
	        RGB_BG(xy.background, v);

	        return col.hue(v);
	    },
	});

	colorjoe.hsl = colorjoe({
	    init: function(col, xy, z) {
	        var ret = oneColorAll(col).hsl();

	        this.xy(ret, { x: ret.hue(), y: 1 - ret.saturation() }, xy, z);
	        this.z(ret, 1 - ret.lightness(), xy, z);

	        return ret;
	    },
	    xy: function(col, p, xy, z) {
	        utils.X(xy.pointer, p.x);
	        utils.Y(xy.pointer, p.y);
	        utils.BG(z.background, col.css()); // #55

	        return col.hue(p.x).saturation(1 - p.y);
	    },
	    z: function(col, v, xy, z) {
	        utils.Y(z.pointer, v);

	        return col.lightness(1 - v);
	    },
	});

	colorjoe.extras = {};

	colorjoe.registerExtra = function(name, fn) {
	    if (name in colorjoe.extras) {
	        console.warn('Extra "' + name + '"has been registered already!');
	    }

	    colorjoe.extras[name] = fn;
	};

	for (var k in extras) {
	    colorjoe.registerExtra(k, extras[k]);
	}

	function RGB_BG(e, h) {
	    utils.BG(e, new oneColorAll.HSV(h, 1, 1).cssa());
	}

	function setup(o) {
	    if (!o.e) {
	        return console.warn("colorjoe: missing element");
	    }

	    var e = isString(o.e) ? document.getElementById(o.e) : o.e;
	    e.className = "colorPicker";

	    var cbs = o.cbs;

	    var xy = dragjs_umd.xyslider({
	        parent: e,
	        class: "twod",
	        cbs: {
	            begin: changeXY,
	            change: changeXY,
	            end: done,
	        },
	    });

	    function changeXY(p) {
	        col = cbs.xy(
	            col,
	            {
	                x: utils.clamp(p.x, 0, 1),
	                y: utils.clamp(p.y, 0, 1),
	            },
	            xy,
	            z
	        );
	        changed();
	    }

	    var z = dragjs_umd.slider({
	        parent: e,
	        class: "oned",
	        cbs: {
	            begin: changeZ,
	            change: changeZ,
	            end: done,
	        },
	    });

	    function changeZ(p) {
	        col = cbs.z(col, utils.clamp(p.y, 0, 1), xy, z);
	        changed();
	    }

	    // Initial color
	    var previous = getColor(o.color);
	    var col = cbs.init(previous, xy, z);
	    var listeners = { change: [], done: [] };

	    function changed(skip) {
	        skip = isArray(skip) ? skip : [];

	        var li = listeners.change;
	        var v;

	        for (var i = 0, len = li.length; i < len; i++) {
	            v = li[i];
	            if (skip.indexOf(v.name) == -1) {
	                v.fn(col);
	            }
	        }
	    }

	    function done() {
	        // Do not call done callback if the color did not change
	        if (previous.equals(col)) {
	            return;
	        }

	        for (var i = 0, len = listeners.done.length; i < len; i++) {
	            listeners.done[i].fn(col);
	        }

	        previous = col;
	    }

	    var ob = {
	        e: e,
	        done: function() {
	            done();

	            return this;
	        },
	        update: function(skip) {
	            changed(skip);

	            return this;
	        },
	        hide: function() {
	            e.style.display = "none";

	            return this;
	        },
	        show: function() {
	            e.style.display = "";

	            return this;
	        },
	        get: function() {
	            return col;
	        },
	        set: function(c) {
	            var oldCol = this.get();
	            col = cbs.init(getColor(c), xy, z);

	            if (!oldCol.equals(col)) {
	                this.update();
	            }

	            return this;
	        },
	        getAlpha: function() {
	            return col.alpha();
	        },
	        setAlpha: function(v) {
	            col = col.alpha(v);

	            this.update();

	            return this;
	        },
	        on: function(evt, cb, name) {
	            if (evt == "change" || evt == "done") {
	                listeners[evt].push({ name: name, fn: cb });
	            } else {
	                console.warn(
	                    'Passed invalid evt name "' + evt + '" to colorjoe.on'
	                );
	            }

	            return this;
	        },
	        removeAllListeners: function(evt) {
	            if (evt) {
	                listeners[evt] = [];
	            } else {
	                for (var key in listeners) {
	                    listeners[key] = [];
	                }
	            }

	            return this;
	        },
	    };

	    setupExtras(e, ob, o.extras);
	    changed();

	    return ob;
	}

	function getColor(c) {
	    if (!isDefined(c)) {
	        return oneColorAll("#000");
	    }
	    if (c.isColor) {
	        return c;
	    }

	    var ret = oneColorAll(c);

	    if (ret) {
	        return ret;
	    }

	    if (isDefined(c)) {
	        console.warn("Passed invalid color to colorjoe, using black instead");
	    }

	    return oneColorAll("#000");
	}

	function setupExtras(p, joe, extras$$1) {
	    if (!extras$$1) {
	        return;
	    }

	    var c = utils.div("extras", p);
	    var cbs;
	    var name;
	    var params;

	    extras$$1.forEach(function(e, i) {
	        if (isArray(e)) {
	            name = e[0];
	            params = e.length > 1 ? e[1] : {};
	        } else {
	            name = e;
	            params = {};
	        }
	        var extra = name in colorjoe.extras ? colorjoe.extras[name] : null;

	        if (extra) {
	            cbs = extra(c, extraProxy(joe, name + i), params);
	            for (var k in cbs) {
	                joe.on(k, cbs[k], name);
	            }
	        }
	    });
	}

	function extraProxy(joe, name) {
	    var ret = copy(joe);

	    ret.update = function() {
	        joe.update([name]);
	    };

	    return ret;
	}

	function copy(o) {
	    // returns a shallow copy
	    var ret = {};

	    for (var k in o) {
	        ret[k] = o[k];
	    }

	    return ret;
	}

	function all(cb, a) {
	    return a.map(cb).filter(id).length == a.length;
	}

	function isArray(o) {
	    return Object.prototype.toString.call(o) === "[object Array]";
	}
	function isString(o) {
	    return typeof o === "string";
	}
	function isDefined(input) {
	    return typeof input !== "undefined";
	}
	function isFunction(input) {
	    return typeof input === "function";
	}
	function id(a) {
	    return a;
	}

	var colorjoe_1 = colorjoe;

	return colorjoe_1;

})));
//# sourceMappingURL=colorjoe.js.map
