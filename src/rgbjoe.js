(function(root, factory) {
  if(typeof define === 'function' && define.amd)
    define(['./colorjoe', './color', './elemutils'], factory);
  else root.rgbjoe = factory(root.colorjoe, root.color, root.elemutils);
}(this, function(colorjoe, color, utils) {
return function(e, initialColor) {
  var joe = colorjoe(e, initialColor).on('change',
    function(c) {
      setBg(c);
      var rgba = color.rgba(c);
      r.input.value = Math.round(rgba.r() * 255);
      g.input.value = Math.round(rgba.g() * 255);
      b.input.value = Math.round(rgba.b() * 255);
      hex.input.value = c.toHex();
    }
  );

  var div = utils.div;
  var labelInput = utils.labelInput;

  var extras = div('extras', joe.e);
  var curColor = div('currentColor', extras);
  var rgb = div('colorFields', extras);

  var r = labelInput('color r', 'R', rgb, 3);
  r.input.onkeyup = updateJoe;

  var g = labelInput('color g', 'G', rgb, 3);
  g.input.onkeyup = updateJoe;

  var b = labelInput('color b', 'B', rgb, 3);
  b.input.onkeyup = updateJoe;

  var hex = labelInput('hex', '', extras, 6);
  hex.input.onkeyup = function(e) {
    var val = e.target.value;
    joe.set(val);

    var col = joe.get();
    setBg(col);

    var rgb = color.rgba(col);
    r.input.value = Math.round(rgb.r() * 255);
    g.input.value = Math.round(rgb.g() * 255);
    b.input.value = Math.round(rgb.b() * 255);
  };

  joe.update();

  function updateJoe(e) {
    var rgb = color.rgba({
      r: r.input.value / 255,
      g: g.input.value / 255,
      b: b.input.value / 255
    });
    joe.set(rgb);

    var col = joe.get();
    hex.input.value = col.toHex();
    setBg(col);
  }

  function setBg(c) {
    curColor.style.background = c.toCSS();
  }

  return joe;
};
}));
