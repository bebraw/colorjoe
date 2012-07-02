/*
 * References:
 * * http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
 * * http://stackoverflow.com/questions/1291325/drag-drop-problem-draggable-in-positionrelative-parent
 *
 * Note that default drag does not work with position: relative by default!
 * */
(function(root, factory) {
    if(typeof define === 'function' && define.amd) define(factory);
    else root.drag = factory();
}(this, function() {

function drag(elem, cbs) {
    if(!elem) {
        console.warn('drag is missing elem!');
        return;
    }

    if(isTouch()) dragTemplate(elem, cbs, 'touchstart', 'touchmove', 'touchend');
    else dragTemplate(elem, cbs, 'mousedown', 'mousemove', 'mouseup');
}
return drag;

// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function isTouch() {
    return typeof(window.ontouchstart) != 'undefined';
}

function dragTemplate(elem, cbs, down, move, up) {
    var dragging = false;

    cbs = getCbs(cbs);

    var beginCb = cbs.begin;
    var changeCb = cbs.change;
    var endCb = cbs.end;

    on(elem, down, function(e) {
        dragging = true;

        var moveHandler = partial(callCb, changeCb, elem);
        function upHandler() {
            dragging = false;

            off(document, move, moveHandler);
            off(document, up, upHandler);

            callCb(endCb, elem, e);
        }

        on(document, move, moveHandler);
        on(document, up, upHandler);

        callCb(beginCb, elem, e);
    });
    on(elem, up, function(e) {
        dragging = false;

        callCb(endCb, elem, e);
    });
}

function on(elem, evt, handler) {
    elem.addEventListener(evt, handler, false);
}

function off(elem, evt, handler) {
    elem.removeEventListener(evt, handler, false);
}

function getCbs(cbs) {
    if(!cbs) {
        var initialOffset;
        var initialPos;

        return {
            begin: function(c) {
                initialOffset = {x: c.elem.offsetLeft, y: c.elem.offsetTop};
                initialPos = c.cursor;
            },
            change: function(c) {
                style(c.elem, 'left', (initialOffset.x + c.cursor.x - initialPos.x) + 'px');
                style(c.elem, 'top', (initialOffset.y + c.cursor.y - initialPos.y) + 'px');
            },
            end: empty
        };
    }
    else {
        return {
            begin: cbs.begin || empty,
            change: cbs.change || empty,
            end: cbs.end || empty
        };
    }
}

// TODO: set draggable class (handy for fx)

function style(e, prop, value) {
    e.style[prop] = value;
}

function empty() {}

function callCb(cb, elem, e) {
    e.preventDefault();

    var offset = findPos(elem);
    var width = elem.clientWidth;
    var height = elem.clientHeight;
    var cursor = {
        x: cursorX(e),
        y: cursorY(e)
    };
    var x = (cursor.x - offset.x) / width;
    var y = (cursor.y - offset.y) / height;

    cb({
        x: isNaN(x)? 0: x,
        y: isNaN(y)? 0: y,
        cursor: cursor,
        elem: elem,
        e: e
    });
}

// http://stackoverflow.com/questions/4394747/javascript-curry-function
function partial(fn) {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments, [1]);

    return function() {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}

// http://www.quirksmode.org/js/findpos.html
function findPos(e) {
    var x = 0;
    var y = 0;

    if(e.offsetParent) {
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
        } while (e = e.offsetParent);
      }

    return {x: x, y: y}; 
}

// http://javascript.about.com/library/blmousepos.htm
function cursorX(evt) {
    if(evt.pageX) return evt.pageX;
    else if(evt.clientX)
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
}
function cursorY(evt) {
    if(evt.pageY) return evt.pageY;
    else if(evt.clientY)
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
}
}));
