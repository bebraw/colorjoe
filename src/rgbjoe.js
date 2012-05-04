(function(root, factory) {
  if(typeof define === 'function' && define.amd) define([], factory);
  else root.rgbjoe = factory();
}(this, function() {
return function(e, initialColor) {
   var joe = colorjoe({element: e, initialColor: initialColor, cbs: {
    change: function(c) {
      setBg(c);
      var rgba = color.rgba(c);
      r.input.value = Math.round(rgba.r() * 255);
      g.input.value = Math.round(rgba.g() * 255);
      b.input.value = Math.round(rgba.b() * 255);
      hex.input.value = c.toHex();
    }
  }});
  
  var extras = div('extras', joe.e);
  var curColor = div('currentColor', extras);
  var rgb = div('rgb', extras);
  
  var r = labelInput('color r', 'R', rgb, 3); 
  r.input.onkeyup = updateJoe;
  
  var g = labelInput('color g', 'G', rgb, 3); 
  g.input.onkeyup = updateJoe;
  
  var b = labelInput('color b', 'B', rgb, 3); 
  b.input.onkeyup = updateJoe;
  
  var hex = labelInput('hex', '', extras, 6); 
  hex.input.onkeyup = function(e) {
    var val = e.target.value;
    var hsva = color.hsva(val);
    var rgba = color.rgba(val);
    
    joe.set(hsva);
    setBg(hsva);
    r.input.value = Math.round(rgba.r() * 255);
    g.input.value = Math.round(rgba.g() * 255);
    b.input.value = Math.round(rgba.b() * 255);
  };  
  
  joe.update();

  function updateJoe(e) {
    var val = e.target.value;
    var hsva = color.hsva(color.rgba({
      r: r.input.value / 255,
      g: g.input.value / 255,
      b: b.input.value / 255 
    }));

    joe.set(hsva);
    setBg(hsva);
  }
  
  function setBg(c) {
    curColor.style.background = c.toCSS();
  }
};

function labelInput(klass, n, p, maxLen) {
  var d = div(klass, p); 
  var l = label(n, d); 
  var i = input('text', d, maxLen);
  
  return {label: l, input: i}; 
}

function label(c, p) {
  var e = document.createElement('label');
  e.innerHTML = c;
  p.appendChild(e);
  
  return e;
}

function input(t, p, maxLen) {
  var e = document.createElement('input');
  e.type = t;
  if(maxLen) e.maxLength = maxLen;
  p.appendChild(e);

  return e;
}

// TODO: move to utils
function div(klass, p) {
  var elem = document.createElement('div');
  elem.className = klass;
  p.appendChild(elem);

  return elem;
}
}));
