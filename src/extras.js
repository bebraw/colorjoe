function currentColor(p) {
  var e1 = utils.div('currentColorContainer', p);
  var e = utils.div('currentColor', e1);

  return {
    change: function(col) {
      utils.BG(e, col.cssa());
    }
  };
}

function fields(p, joe, o) {
  var cs = o.space;
  var fac = o.limit || 255;
  var fix = o.fix >= 0? o.fix: 0;
  var inputLen = ('' + fac).length + fix;
  inputLen = fix? inputLen + 1: inputLen;

  var initials = cs.split('');
  var useAlpha = cs[cs.length - 1] == 'A';
  cs = useAlpha? cs.slice(0, -1): cs;

  if(['RGB', 'HSL', 'HSV', 'CMYK'].indexOf(cs) < 0)
    return console.warn('Invalid field names', cs);

  var c = utils.div('colorFields', p);
  var elems = initials.map(function(n, i) {
    n = n.toLowerCase();

    var e = utils.labelInput('color ' + n, n, c, inputLen);
    e.input.onblur = done;
    e.input.onkeydown = validate;
    e.input.onkeyup = update;

    return {name: n, e: e};
  });

  function done() {
    joe.done();
  }

  function validate(e) {
    if (!(e.ctrlKey || e.altKey) && /^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function update() {
    var col = [cs];

    elems.forEach(function(o) {col.push(o.e.input.value / fac);});

    if(!useAlpha) col.push(joe.getAlpha());

    joe.set(col);
  }

  return {
    change: function(col) {
      elems.forEach(function(o) {
        o.e.input.value = (col[o.name]() * fac).toFixed(fix);
      });
    }
  };
}

function alpha(p, joe) {
  var e = drag.slider({
    parent: p,
    'class': 'oned alpha',
    cbs: {
      begin: change,
      change: change,
      end: done
    }
  });

  function done() {
    joe.done();
  }

  function change(p) {
    var val = utils.clamp(p.y, 0, 1);

    utils.Y(p.pointer, val);
    joe.setAlpha(1 - val);
  }

  return {
    change: function(col) {
      utils.Y(e.pointer, 1 - col.alpha());
    }
  };
}

function hex(p, joe, o) {
  var e = utils.labelInput('hex', o.label || '', p, 7);
  e.input.value = '#';

  e.input.onkeyup = function(elem) {
    var key = elem.keyCode || elem.which;
    var val = elem.target.value;
    val = val[0] == '#'? val: '#' + val;
    val = pad(val, 7, '0');

    if(key == 13) joe.set(val);
  };

  e.input.onblur = function(elem) {
    joe.set(elem.target.value);
    joe.done();
  };

  return {
    change: function(col) {
      e.input.value = e.input.value[0] == '#'? '#': '';
      e.input.value += col.hex().slice(1);
    }
  };
}

function close(p, joe, o) {
  var elem = utils.e('a', o['class'] || 'close', p);
  elem.href = '#';
  elem.innerHTML = o.label || 'Close';

  elem.onclick = function(e) {
    e.preventDefault();

    joe.hide();
  };
}

function pad(a, n, c) {
  var ret = a;

  for(var i = a.length, len = n; i < n; i++) ret += c;

  return ret;
}

var extras = {
  currentColor: currentColor,
  fields: fields,
  hex: hex,
  alpha: alpha,
  close: close
};
