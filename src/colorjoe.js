(function(root, factory) {
  if(typeof define === 'function' && define.amd) define(factory);
  else root.colorjoe = factory();
}(this, function() {
var ret = function(o) {
  o.cbs = o.cbs || {};
  
  var picker = o.element;
  if(isString(o.element)) picker = document.getElementById(o.element);
  
  if(picker) return setup(picker, o.initialColor);

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

    drag(oned, function(p) {
      hsv.h(p.y);
      H(p.y);
      changed(hsv);
    }, done);
    
    drag(twod, function(p) {
      hsv.s(p.x);
      hsv.v(1 - p.y);
      SV(p.x, p.y);
      changed(hsv);
    }, done);

    H(hsv.h());
    SV(hsv.s(), hsv.v());

    function H(h) {
      p2.style.top = clamp(h * 100, 0, 100) + '%';
      twod.style.background = color.hsva({h: h, s: 1, v: 1}).toCSS();    
    }

    function SV(s, v) {
      p1.style.left = clamp(s * 100, 0, 100) + '%';
      p1.style.top = clamp(v * 100, 0, 100) + '%'; 
    }

    var changeListeners = [];
    function changed() {
      for(var i = 0, len = changeListeners.length; i < len; i++)
        changeListeners[i](hsv);
    }

    var doneListeners = [];
    function done() {
      for(var i = 0, len = doneListeners.length; i < len; i++)
        doneListeners[i](hsv);
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
        hsv = c;
        H(c.h());
        SV(c.s(), c.v());

        return ob;
      },
      on: function(evt, cb) {
        if(evt == 'change') changeListeners.push(cb);
        if(evt == 'done') doneListeners.push(cb);

        return ob;
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

function drag(elem, changeCb, doneCb) {
  var dragging = false;
  
  // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  var isTouch = typeof(window.ontouchstart) != 'undefined';
  
  if(isTouch) {
    elem.ontouchstart = function(e) {
      e.preventDefault();
      dragging = true;

      document.ontouchend = function() {
        dragging = false;

        document.ontouchend = '';
        document.ontouchmove = '';
      
        callCb(doneCb, e);
      };
      
      document.ontouchmove = partial(callCb, changeCb);
    };
    elem.ontouchend = function(e) {
      e.preventDefault();
      dragging = false;

      callCb(doneCb, e);
    };
  }
  else {
    elem.onmousedown = function(e) {
      e.preventDefault();
      dragging = true;
    
      document.onmouseup = function() {
        dragging = false;
        
        document.onmouseup = '';
        document.onmousemove = '';

        callCb(doneCb, e);
      };
    
      document.onmousemove = partial(callCb, changeCb);
    };
    elem.onmouseup = function(e) {
      e.preventDefault();
      dragging = false;
    
      callCb(doneCb, e);
    };
  }
  
  function callCb(cb, e) {
    e.preventDefault();

    var xOffset = elem.offsetLeft;
    var yOffset = elem.offsetTop;
    var width = elem.clientWidth;
    var height = elem.clientHeight;

    cb({x: (mouseX(e) - xOffset) / width, y: (mouseY(e) - yOffset) / height});
  }
}

// http://javascript.about.com/library/blmousepos.htm
function mouseX(evt) {
  if(evt.pageX) return evt.pageX;
  else if(evt.clientX)
    return evt.clientX + (document.documentElement.scrollLeft ?
      document.documentElement.scrollLeft :
      document.body.scrollLeft);
}
function mouseY(evt) {
  if(evt.pageY) return evt.pageY;
  else if(evt.clientY)
    return evt.clientY + (document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop);
}
}));
