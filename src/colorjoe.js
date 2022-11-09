var drag = require('dragjs');
var ONECOLOR = require('onecolor/one-color-all'); // Use the all build with cmyk and everything
var utils = require('./utils');
var extras = require('./extras');

var colorjoe = function(cbs) {
    if (!all(isFunction, [cbs.init, cbs.xy, cbs.z])) {
        return console.warn("colorjoe: missing cb");
    }

    return function(element, initialColor, extras) {
        return setup({
            e: element,
            color: initialColor,
            cbs: cbs,
            extras: extras,
        });
    };
};

/* pickers */
colorjoe.rgb = colorjoe({
    init: function(col, xy, z) {
        var ret = ONECOLOR(col).hsv();

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
        var ret = ONECOLOR(col).hsl();

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
    utils.BG(e, new ONECOLOR.HSV(h, 1, 1).cssa());
}

function setup(o) {
    if (!o.e) {
        return console.warn("colorjoe: missing element");
    }

    var e = isString(o.e) ? document.getElementById(o.e) : o.e;
    e.className = "colorPicker";

    var cbs = o.cbs;

    var xy = drag.xyslider({
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

    var z = drag.slider({
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
        return ONECOLOR("#000");
    }
    if (c.isColor) {
        return c;
    }

    var ret = ONECOLOR(c);

    if (ret) {
        return ret;
    }

    if (isDefined(c)) {
        console.warn("Passed invalid color to colorjoe, using black instead");
    }

    return ONECOLOR("#000");
}

function setupExtras(p, joe, extras) {
    if (!extras) {
        return;
    }

    var c = utils.div("extras", p);
    var cbs;
    var name;
    var params;

    extras.forEach(function(e, i) {
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

module.exports = colorjoe;
