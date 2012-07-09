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
    col = cbs.xy(col, p, xy, z);
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
    col = cbs.z(col, p.y, xy, z);
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

   return ret? ret: onecolor('black');
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
function isFunction(input) {return typeof input === "function";}
function id(a) {return a;}
}));
