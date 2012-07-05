# colorjoe - The Scaleable Color Picker

colorjoe was somewhat inspired by
[ColorJack](http://www.dynamicdrive.com/dynamicindex11/colorjack/index.htm) and
[RightJS Colorpicker](http://rightjs.org/ui/colorpicker). Unlike those it
actually scales pretty well. Essentially this means that you'll be able to
define its actual dimensions and layout using a bit of CSS. This way the widget
fits well responsive layouts.

In addition it's relatively easy to implement missing functionality (RGB fields,
whatnot) thanks to the simple API it provides.

## Installation

Add prepackaged `dist/colorjoe.js` and `css/colorjoe.css` to you page or use AMD to load
the dependencies from `src/`.

## Usage

```javascript
var joe = colorjoe(element_id_or_dom_object, initial_color_value);
```

or

```javascript
var joe = rgbjoe(element_id_or_dom_object, initial_color_value);
```

The returned joe object is an event emitter style object with `change` and
`done` events. The `change` event is fired continuously when selecting and
`done` is fired when user has stopped selecting.


```javascript
joe.on("change", function(color) {
    console.log("Selecting " + color.toCSS());
});

joe.on("done", function(color) {
    console.log("Selected " + color.toCSS());
});
```

The color object is from [colorjs](http://bebraw.github.com/colorjs/).

## Contributors

* [Juho Vepsäläinen](https://github.com/bebraw) - Core
* [Esa-Matti Suuronen](https://github.com/epeli) -
  [Grunt](https://github.com/cowboy/grunt) support + removeAllListeners

## Hacking

Use [grunt](http://gruntjs.com/) command to build prepackaged files in `dist/`.

## License

colorjoe is available under MIT. See [LICENSE](https://github.com/bebraw/colorjoe/blob/master/LICENSE) for more details.

