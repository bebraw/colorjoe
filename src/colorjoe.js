(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./color', './drag', './elemutils'], factory);
  else root.colorjoe = factory(root.color, root.drag, root.elemutils);
}(this, function(color, drag, utils) {
var picker = function(cbs) {
  if(!all(isFunction, [cbs.init, cbs.xy, cbs.z]))
    return console.warn('colorjoe: missing cb');

  return function(element, initialColor, extras) {
    setup({
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
    var ret = color.hsva(col);

    this.xy(ret, {x: ret.s(), y: 1 - ret.v()}, xy, z);
    this.z(ret, ret.h(), xy, z);

    return ret;
  },
  xy: function(col, p, xy, z) {
    X(xy.pointer, p.x);
    Y(xy.pointer, p.y);

    return col.s(p.x).v(1 - p.y);
  },
  z: function(col, v, xy, z) {
    Y(z.pointer, v);
    RGB_BG(xy.background, v);

    return col.h(v);
  }
});

function RGB_BG(e, h) {BG(e, color.hsva({h: h, s: 1, v: 1}).toCSS());}

// TODO
picker.hsl = picker({
  init: function() {},
  xy: function() {},
  z: function() {}
});

/* extras */
function currentColor(p) {
  var e = utils.div('currentColor', p);

  return {
    change: function(col) {
      BG(e, col.toCSS());
    }
  };
}

function fields(x, y, z, fac) {
  fac = fac || 255;

  return function(p, joe) {
    var c = utils.div('colorFields', p);
    var elems = [x, y, z].map(function(n) {
      var e = utils.labelInput('color ' + n, n.toUpperCase(), c, 3);
      e.input.onkeyup = update;

      return e;
    });

    function update() {
      var col = {};

      elems.forEach(function(e) {
        var n = e.label.innerHTML.toLowerCase();
        col[n] = e.input.value / fac;
      });

      joe.set(color.rgba(col));
    }

    return {
      change: function(col) {
        var rgb = color.rgba(col);

        elems.forEach(function(e) {
          var n = e.label.innerHTML.toLowerCase();
          e.input.value = Math.round(rgb[n]() * fac);
        });
      }
    };
  };
}

function hex(p, joe) {
  var e = utils.labelInput('hex', '', p, 6);
  e.input.onkeyup = function(elem) {
    joe.set(elem.target.value);
  };

  return {
    change: function(col) {
      e.input.value = col.toHex();
    }
  };
}

picker.extras = {
  currentColor: currentColor,
  fields: fields,
  hex: hex
};

return picker;

function X(p, a) {p.style.left = clamp(a * 100, 0, 100) + '%';}
function Y(p, a) {p.style.top = clamp(a * 100, 0, 100) + '%';}
function BG(e, c) {e.style.background = c;}

function setup(o) {
  if(!o.e) return console.warn('colorjoe: missing element');

  var e = isString(o.e)? document.getElementById(o.e): o.e;
  e.className = 'colorPicker';

  var cbs = o.cbs;

  var xy = xyslider({
    parent: e,
    'class': 'twod',
    cbs: {
      begin: changeXY,
      change: changeXY,
      end: done
    }
  });

  function changeXY(p) {
    col = cbs.xy(col, p, xy, z);
    changed();
  }

  var z = slider({
    parent: e,
    'class': 'oned',
    cbs: {
      begin: changeZ,
      change: changeZ,
      end: done
    }
  });

  function changeZ(p) {
    col = cbs.z(col, p.y, xy, z);
    changed();
  }

  var col = cbs.init(o.color, xy, z);
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
      return color.rgba(col);
    },
    set: function(c) {
      col = cbs.init(c, xy, z);

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

function setupExtras(p, joe, extras) {
  if(!extras) return;

  var c = utils.div('extras', p);
  var cbs;

  extras.forEach(function(e) {
    cbs = e(c, joe);

    for(var k in cbs) joe.on(k, cbs[k]);
  });
}

function xyslider(o) {
  var div = utils.div;
  var twod = div(o['class'], o.parent);
  var pointer = div('pointer', twod);
  div('shape shape1', pointer);
  div('shape shape2', pointer);
  div('bg bg1', twod);
  div('bg bg2', twod);

  drag(twod, o.cbs);

  return {
    background: twod,
    pointer: pointer
  };
}

function slider(o) {
  var div = utils.div;
  var oned = div(o['class'], o.parent);
  var pointer = div('pointer', oned);
  div('shape', pointer);
  div('bg', oned);

  drag(oned, o.cbs);

  return {
    background: oned,
    pointer: pointer
  };
}

function all(cb, a) {return a.map(cb).filter(id).length == a.length;}
function clamp(a, minValue, maxValue) {
    return Math.min(Math.max(a, minValue), maxValue);
}
function isString(o) {return typeof(o) === 'string';}
function isFunction(input) {return typeof input === "function";}
function id(a) {return a;}
}));
