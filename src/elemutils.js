(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        root.elemutils = factory();
    }
}(this, function() {
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
        var d = div(klass, p);
        var l = label(n, d);
        var i = input('text', d, maxLen);

        return {label: l, input: i};
    }

    function label(c, p) {
        var elem = e('label', '', p);
        elem.innerHTML = c;

        return elem;
    }

    function input(t, p, maxLen) {
        var elem = e('input', '', p);
        elem.type = t;
        if(maxLen) elem.maxLength = maxLen;

        return elem;
    }

    function X(p, a) {p.style.left = clamp(a * 100, 0, 100) + '%';}
    function Y(p, a) {p.style.top = clamp(a * 100, 0, 100) + '%';}
    function BG(e, c) {e.style.background = c;}

    function clamp(a, minValue, maxValue) {
        return Math.min(Math.max(a, minValue), maxValue);
    }

    return {
        clamp: clamp,
        e: e,
        div: div,
        partial: partial,
        labelInput: labelInput,
        X: X,
        Y: Y,
        BG: BG
    };
}));
