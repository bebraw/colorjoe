/*! colorjoe - v3.0.2 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/colorjoe - 2018-06-24 */
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

	        /*! dragjs - v0.7.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
	https://bebraw.github.com/dragjs - 2016-08-12 */
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

	var oneColor = createCommonjsModule(function (module, exports) {
	!function(t,r){module.exports=r();}(commonjsGlobal,function(){function t(r){if(Array.isArray(r)){if("string"==typeof r[0]&&"function"==typeof t[r[0]])return new t[r[0]](r.slice(1,r.length));if(4===r.length)return new t.RGB(r[0]/255,r[1]/255,r[2]/255,r[3]/255)}else if("string"==typeof r){var n=r.toLowerCase();t.namedColors[n]&&(r="#"+t.namedColors[n]),"transparent"===n&&(r="rgba(0,0,0,0)");var s=r.match(o);if(s){var i=s[1].toUpperCase(),u=e(s[8])?s[8]:parseFloat(s[8]),h="H"===i[0],c=s[3]?100:h?360:255,f=s[5]||h?100:255,l=s[7]||h?100:255;if(e(t[i]))throw new Error("color."+i+" is not installed.");return new t[i](parseFloat(s[2])/c,parseFloat(s[4])/f,parseFloat(s[6])/l,u)}r.length<6&&(r=r.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var p=r.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(p)return new t.RGB(parseInt(p[1],16)/255,parseInt(p[2],16)/255,parseInt(p[3],16)/255);if(t.CMYK){var d=r.match(new RegExp("^cmyk\\("+a.source+","+a.source+","+a.source+","+a.source+"\\)$","i"));if(d)return new t.CMYK(parseFloat(d[1])/100,parseFloat(d[2])/100,parseFloat(d[3])/100,parseFloat(d[4])/100)}}else if("object"==typeof r&&r.isColor)return r;return !1}var r=[],e=function(t){return void 0===t},n=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,a=/\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/,o=new RegExp("^(rgb|hsl|hsv)a?\\("+n.source+","+n.source+","+n.source+"(?:,"+/\s*(\.\d+|\d+(?:\.\d+)?)\s*/.source+")?\\)$","i");t.namedColors={},t.installColorSpace=function(n,a,o){function s(r,e){var n={};n[e.toLowerCase()]=function(){return this.rgb()[e.toLowerCase()]()},t[e].propertyNames.forEach(function(t){var r="black"===t?"k":t.charAt(0);n[t]=n[r]=function(r,n){return this[e.toLowerCase()]()[t](r,n)};});for(var a in n)n.hasOwnProperty(a)&&void 0===t[r].prototype[a]&&(t[r].prototype[a]=n[a]);}t[n]=function(t){var r=Array.isArray(t)?t:arguments;a.forEach(function(t,e){var o=r[e];if("alpha"===t)this._alpha=isNaN(o)||o>1?1:o<0?0:o;else{if(isNaN(o))throw new Error("["+n+"]: Invalid color: ("+a.join(",")+")");"hue"===t?this._hue=o<0?o-Math.floor(o):o%1:this["_"+t]=o<0?0:o>1?1:o;}},this);},t[n].propertyNames=a;var i=t[n].prototype;["valueOf","hex","hexa","css","cssa"].forEach(function(t){i[t]=i[t]||("RGB"===n?i.hex:function(){return this.rgb()[t]()});}),i.isColor=!0,i.equals=function(t,r){e(r)&&(r=1e-10),t=t[n.toLowerCase()]();for(var o=0;o<a.length;o+=1)if(Math.abs(this["_"+a[o]]-t["_"+a[o]])>r)return !1;return !0},i.toJSON=function(){return [n].concat(a.map(function(t){return this["_"+t]},this))};for(var u in o)if(o.hasOwnProperty(u)){var h=u.match(/^from(.*)$/);h?t[h[1].toUpperCase()].prototype[n.toLowerCase()]=o[u]:i[u]=o[u];}return i[n.toLowerCase()]=function(){return this},i.toString=function(){return "["+n+" "+a.map(function(t){return this["_"+t]},this).join(", ")+"]"},a.forEach(function(t){var r="black"===t?"k":t.charAt(0);i[t]=i[r]=function(r,e){return void 0===r?this["_"+t]:e?new this.constructor(a.map(function(e){return this["_"+e]+(t===e?r:0)},this)):new this.constructor(a.map(function(e){return t===e?r:this["_"+e]},this))};}),r.forEach(function(t){s(n,t),s(t,n);}),r.push(n),t},t.pluginList=[],t.use=function(r){return -1===t.pluginList.indexOf(r)&&(this.pluginList.push(r),r(t)),t},t.installMethod=function(e,n){return r.forEach(function(r){t[r].prototype[e]=n;}),this},t.installColorSpace("RGB",["red","green","blue","alpha"],{hex:function(){var t=(65536*Math.round(255*this._red)+256*Math.round(255*this._green)+Math.round(255*this._blue)).toString(16);return "#"+"00000".substr(0,6-t.length)+t},hexa:function(){var t=Math.round(255*this._alpha).toString(16);return "#"+"00".substr(0,2-t.length)+t+this.hex().substr(1,6)},css:function(){return "rgb("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+")"},cssa:function(){return "rgba("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+","+this._alpha+")"}});var s=t,i=function(t){t.installColorSpace("HSV",["hue","saturation","value","alpha"],{rgb:function(){var r,e,n,a=this._hue,o=this._saturation,s=this._value,i=Math.min(5,Math.floor(6*a)),u=6*a-i,h=s*(1-o),c=s*(1-u*o),f=s*(1-(1-u)*o);switch(i){case 0:r=s,e=f,n=h;break;case 1:r=c,e=s,n=h;break;case 2:r=h,e=s,n=f;break;case 3:r=h,e=c,n=s;break;case 4:r=f,e=h,n=s;break;case 5:r=s,e=h,n=c;}return new t.RGB(r,e,n,this._alpha)},hsl:function(){var r,e=(2-this._saturation)*this._value,n=this._saturation*this._value,a=e<=1?e:2-e;return r=a<1e-9?0:n/a,new t.HSL(this._hue,r,e/2,this._alpha)},fromRgb:function(){var r,e=this._red,n=this._green,a=this._blue,o=Math.max(e,n,a),s=Math.min(e,n,a),i=o-s,u=0===o?0:i/o,h=o;if(0===i)r=0;else switch(o){case e:r=(n-a)/i/6+(n<a?1:0);break;case n:r=(a-e)/i/6+1/3;break;case a:r=(e-n)/i/6+2/3;}return new t.HSV(r,u,h,this._alpha)}});},u=function(t){t.use(i),t.installColorSpace("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var r,e=2*this._lightness,n=this._saturation*(e<=1?e:2-e);return r=e+n<1e-9?0:2*n/(e+n),new t.HSV(this._hue,r,(e+n)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}});};return s.use(i).use(u)});

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

	// Use the minimal build without color names



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
	        var ret = oneColor(col).hsv();

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
	        var ret = oneColor(col).hsl();

	        this.xy(ret, { x: ret.hue(), y: 1 - ret.saturation() }, xy, z);
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
	    },
	});

	colorjoe._extras = {};

	colorjoe.registerExtra = function(name, fn) {
	    if (name in colorjoe._extras) {
	        console.warn('Extra "' + name + '"has been registered already!');
	    }

	    colorjoe._extras[name] = fn;
	};

	for (var k in extras) {
	    colorjoe.registerExtra(k, extras[k]);
	}

	function RGB_BG(e, h) {
	    utils.BG(e, new oneColor.HSV(h, 1, 1).cssa());
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
	                delete listeners[evt];
	            } else {
	                for (var key in listeners) {
	                    delete listeners[key];
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
	        return oneColor("#000");
	    }
	    if (c.isColor) {
	        return c;
	    }

	    var ret = oneColor(c);

	    if (ret) {
	        return ret;
	    }

	    if (isDefined(c)) {
	        console.warn("Passed invalid color to colorjoe, using black instead");
	    }

	    return oneColor("#000");
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
	        var extra = name in colorjoe._extras ? colorjoe._extras[name] : null;

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
