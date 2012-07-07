(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./color', './drag', './elemutils'], factory);
  else root.colorjoe = factory(root.color, root.drag, root.elemutils);
}(this, function(color, drag, utils) {
var picker = function(cbs) {
  if(!all(isFunction, [cbs.init, cbs.xy, cbs.z]))
    return console.warn('colorjoe: missing cb');

  return function(element, initialColor, widgets) {
    setup({
      e: element,
      color: initialColor,
      cbs: cbs,
      widgets: widgets
    });
  };
};

picker.rgb = picker({
  init: function(col, xy, z) {
    var ret = color.hsva(col);

    this.xy(ret, {x: ret.s(), y: ret.v()}, xy, z);
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

function X(p, a) {p.style.left = clamp(a * 100, 0, 100) + '%';}
function Y(p, a) {p.style.top = clamp(a * 100, 0, 100) + '%';}
function BG(e, c) {e.style.background = c;}

// TODO
picker.hsl = picker({
  init: function() {},
  xy: function() {},
  z: function() {}
});

return picker;

function setup(o) {
  if(!o.e) return console.warn('colorjoe: missing element');

  var e = isString(o.e)? document.getElementById(o.e): o.e;
  e.className = 'colorPicker';

  // TODO: widgets

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
      col = cbs.init(c, xy.pointer, z.pointer);

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
