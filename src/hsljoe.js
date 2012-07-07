(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./colorjoe', './color', './elemutils'], factory);
  else root.hsljoe = factory(root.colorjoe, root.color, root.elemutils);
}(this, function(colorjoe, color, utils) {
return function(e, initialColor) {
  var joe = colorjoe(e, initialColor).on('change',
    function(c) { // XXX: not ok. need to customize the mapping
    // h = x, s = y, l = 2d slider
      var hsla = color.hsla(c);
      h.input.value = Math.round(hsla.h() * 100);
      s.input.value = Math.round(hsla.s() * 100);
      l.input.value = Math.round(hsla.l() * 100);
      hex.input.value = c.toHex();
    }
  );

  var div = utils.div;
  var extras = div('extras', joe.e);
  var curColor = div('currentColor', extras);
  var hsl = div('colorFields', extras);

  var h = utils.labelInput('color h', 'H', hsl, 3);
  h.input.onkeyup = updateJoe;

  var s = utils.labelInput('color s', 'S', hsl, 3);
  s.input.onkeyup = updateJoe;

  var l = utils.labelInput('color l', 'L', hsl, 3);
  l.input.onkeyup = updateJoe;

  var hex = utils.labelInput('hex', '', extras, 6);
  hex.input.onkeyup = function(e) {
    var val = e.target.value;
    joe.set(val);

    var col = joe.get();

    var hsl = color.hsla(col);
    h.input.value = Math.round(hsl.h() * 100);
    s.input.value = Math.round(hsl.s() * 100);
    l.input.value = Math.round(hsl.l() * 100);
  };

  joe.update();

  function updateJoe(e) {
    var hsl = color.hsla({
      h: h.input.value / 100,
      s: s.input.value / 100,
      l: l.input.value / 100
    });
    joe.set(hsl);

    var col = joe.get();
    hex.input.value = col.toHex();
  }
};
}));
