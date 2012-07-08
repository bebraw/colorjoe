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
var joe = colorjoe.rgb(element_id_or_dom_object, initial_color_value, extras);
```

or

```javascript
var joe = colorjoe.hsl(element_id_or_dom_object, initial_color_value, extras);
```

### Event Handling

The returned joe object is an event emitter style object with `change` and
`done` events. The `change` event is fired continuously when selecting and
`done` is fired when user has stopped selecting.


```javascript
joe.on("change", function(color) {
    console.log("Selecting " + color.css());
});

joe.on("done", function(color) {
    console.log("Selected " + color.css());
});
```

The color object is from [one.color](https://github.com/One-com/one-color).

Given it might be nice to trigger these events immediately, there is a specific
`update` method. Ie. joe.on("change", function() {...}).update() would trigger
`change` immediately. This is handy for initializing your work.

### Get and Set

In addition there are `set` and `get` methods. Ie. joe.get() would return the
current color while joe.set('#aabbcc') would set it. `set` expects a parameter
that one.color default constructor would accept.

### Extras

In order to make it easier to customize a picker based on your needs, colorjoe
provides a few extras. The following example shows how to use them:

```javascript
var joe = colorjoe.hsl('hslPicker', 'red', [
    colorjoe.extras.currentColor,
    colorjoe.extras.fields('HSL', 255, 0),
    colorjoe.extras.hex
]);
```

The code above would generate a HSL picker that shows in addition the currently
selected color, HSL input fields and a hex field.

`fields` extra is a factory that accepts name of a color space (RGB, HSL, HSV
or CMYK). In addition it takes maximum value (defaults to 255) and a fix value
(defaults to 2). fix represents the amount of numbers shown after decimal.

## Contributors

* [Juho Vepsäläinen](https://github.com/bebraw) - Core
* [Esa-Matti Suuronen](https://github.com/epeli) -
  [Grunt](https://github.com/cowboy/grunt) support + removeAllListeners
* [Peter Müller](https://github.com/Munter) -
  [one.color](https://github.com/One-com/one-color) + HTML tweaks

## Hacking

Download the dependencies using `npm` (npm install) and then use [grunt](http://gruntjs.com/) to build prepackaged files in `dist/`.

## License

colorjoe is available under MIT. See [LICENSE](https://github.com/bebraw/colorjoe/blob/master/LICENSE) for more details.

