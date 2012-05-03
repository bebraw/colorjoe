function colorjoe(o) {
  o.cbs = o.cbs || {};
  
  // XXX: works only with element id now
  var picker = document.getElementById(o.element);
  
  if(picker) return setup(picker, o.initialColor, o.cbs.change);

  function setup(picker, col, chg) {
    chg = chg || function() {};

    var hsv = color.hsva(col);
    
    picker.className = 'colorPicker';
  
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
      chg(hsv);
    });
    
    drag(twod, function(p) {
      hsv.s(p.x);
      hsv.v(1 - p.y);
      SV(p.x, p.y);
      chg(hsv);
    });

    H(hsv.h());
    SV(hsv.s(), hsv.v());

    function H(h) {
      p2.style.top = utils.clamp(h * 100, 0, 100) + '%';
      twod.style.background = color.hsva({h: h, s: 1, v: 1}).toCSS();    
    }

    function SV(s, v) {
      p1.style.left = utils.clamp(s * 100, 0, 100) + '%';
      p1.style.top = utils.clamp(v * 100, 0, 100) + '%'; 
    }
    
    return {
      e: picker,
      update: function() {
        chg(hsv);
      },
      set: function(c) {
        hsv = c;
        H(c.h());
        SV(c.s(), c.v());
      }
    };
  }
}

function div(klass, p) {
  var elem = document.createElement('div');
  elem.className = klass;
  p.appendChild(elem);

  return elem;
}

function drag(elem, fn) {
  var dragging = false;
  
  // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  var isTouch = typeof(window.ontouchstart) != 'undefined';
  
  if(isTouch) {
    elem.ontouchstart = function(e) {
      e.preventDefault();
      dragging = true;
      
      document.ontouchend = '';
      document.ontouchmove = '';
      
      callCb(e);
    };
    elem.ontouchmove = callCb;
    elem.ontouchend = function(e) {
      e.preventDefault();
      dragging = false;
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
      };
    
      document.onmousemove = callCb;
    };
    elem.onmouseup = function(e) {
      e.preventDefault();
      dragging = false;
    
      callCb(e);
    };
  }
  
  function callCb(e) {
    e.preventDefault();

    var xOffset = elem.offsetLeft;
    var yOffset = elem.offsetTop;
    var width = elem.clientWidth;
    var height = elem.clientHeight;

    fn({x: (mouseX(e) - xOffset) / width, y: (mouseY(e) - yOffset) / height});
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

