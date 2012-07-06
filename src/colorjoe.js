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
