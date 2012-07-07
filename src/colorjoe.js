(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    // XXX: missing one-color (require AMD support to work!)
    define(['./drag', './elemutils'], factory);
  else root.colorjoe = factory(root.ONECOLOR, root.drag, root.elemutils);
}(this, function(onecolor, drag, utils) {
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
    X(xy.pointer, p.x);
    Y(xy.pointer, p.y);

    return col.saturation(p.x).value(1 - p.y);
  },
  z: function(col, v, xy, z) {
    Y(z.pointer, v);
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
    X(xy.pointer, p.x);
    Y(xy.pointer, p.y);
    RGB_BG(z.background, p.x);

    return col.hue(p.x).saturation(1 - p.y);
  },
  z: function(col, v, xy, z) {
    Y(z.pointer, v);

    return col.lightness(1 - v);
  }
});

/* extras */
function currentColor(p) {
  var e = utils.div('currentColor', p);

  return {
    change: function(col) {
      BG(e, col.cssa());
    }
  };
}

// TODO: alpha?
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
      var col = [];

      elems.forEach(function(o) {col.push(o.e.input.value / fac);});

      chg = true;
      joe.set(construct(onecolor[cs], col));
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

// http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
function construct(constructor, args) {
  function F() {
    return constructor.apply(this, args);
  }
  F.prototype = constructor.prototype;
  return new F();
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

picker.extras = {
  currentColor: currentColor,
  fields: fields,
  hex: hex
};

return picker;

function RGB_BG(e, h) {BG(e, new onecolor.HSV(h, 1, 1).cssa());}
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
      return col;
    },
    set: function(c) {
      var oldCol = this.get();
      col = cbs.init(c, xy, z);

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
