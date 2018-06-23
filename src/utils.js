var div = partial(e, 'div');

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

function labelInput(klass, n, p, maxLen) {
    var id = "colorPickerInput" + Math.floor(Math.random() * 1001);
    var d = div(klass, p);
    var l = label(n, d, id);
    var i = input('text', d, maxLen, id);

    return {
        label: l, 
        input: i
    };
}

function label(c, p, id) {
    var elem = e('label', '', p);
    elem.innerHTML = c;

    if (id) {
        elem.setAttribute('for', id);
    }

    return elem;
}

function input(t, p, maxLen, id) {
    var elem = e('input', '', p);
    elem.type = t;

    if(maxLen) { 
        elem.maxLength = maxLen;
    }

    if (id) {
        elem.setAttribute('id', id);
    }

    if(maxLen) {
        elem.maxLength = maxLen;
    }

    return elem;
}

function X(p, a) {
    p.style.left = clamp(a * 100, 0, 100) + '%';
}
function Y(p, a) {
    p.style.top = clamp(a * 100, 0, 100) + '%';
}
function BG(e, c) {
    e.style.background = c;
}

function clamp(a, minValue, maxValue) {
    return Math.min(Math.max(a, minValue), maxValue);
}

module.exports = {
    clamp: clamp,
    e: e,
    div: div,
    partial: partial,
    labelInput: labelInput,
    X: X,
    Y: Y,
    BG: BG
};
