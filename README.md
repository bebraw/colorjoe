<h1 align=center>
<img src="media/logo.png" width=30%>
</h1>

# colorjoe - The Scaleable Color Picker

colorjoe was somewhat inspired by
[ColorJack](http://www.dynamicdrive.com/dynamicindex11/colorjack/index.htm) and
[RightJS Colorpicker](http://rightjs.org/ui/colorpicker/demo). Unlike those it
actually scales pretty well. Essentially this means that you'll be able to
define its actual dimensions and layout using a bit of CSS. This way the widget
fits well responsive layouts.

In addition it's relatively easy to implement missing functionality (RGB fields,
whatnot) thanks to the simple API it provides.

## Installation

```bash
npm i colorjoe
```

If you prefer a standalone dist, add prepackaged `dist/colorjoe.js` and `css/colorjoe.css` to your page or use AMD to load
the dependencies from `src/`.

## Usage

```javascript
const joe = colorjoe.rgb(element_id_or_dom_object, initial_color_value, extras);
```

or

```javascript
const joe = colorjoe.hsl(element_id_or_dom_object, initial_color_value, extras);
```

### Event Handling

The returned joe object is an event emitter style object with `change` and
`done` events. The `change` event is fired continuously when selecting and
`done` is fired when user has stopped selecting.


```javascript
joe.on("change", color => console.log("Selecting " + color.css()));
joe.on("done", color => console.log("Selected " + color.css()));
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
const joe = colorjoe.hsl('hslPicker', 'red', [
    'currentColor',
    'alpha',
    ['fields', {space: 'HSL', limit: 255, fix: 0},
    'hex'
]);
```

The code above would generate a HSL picker that shows in addition the currently
selected color, alpha slider, HSL input fields and a hex field.

As you can see `fields` has been defined using an array. This array contains
the name of the extra and then parameters passed to inside an object. In this
case the extra accepts name of a color space (RGB, HSL, HSV or CMYK). If you
append `A` to the color space, it will show a control for alpha too. In
addition it takes a limit value (defaults to 255) and a fix value
(defaults to 0). fix represents the amount of numbers shown after decimal.

`hex` extra accepts optional `label`. If set it will show that as the input's
label.

### Implementing Custom Extras

It is possible to implement your custom extras without having to hack the core
code. This can be done as follows:

```javascript
colorjoe.registerExtra('text', (p, joe, o) => {
    // attach new elements to p element here (as children that is)
    // o is optional and will contain any parameters you might have
    // passed to the extra using the array syntax

    // optional return. these are triggered by colorjoe
    // use this way instead of joe.on
    return {
        change(col) {},
        done(col) {}
    };
})
```

Now you can simply pass your `text` extra amongst the others and it will just
work.

## Sites Using colorjoe

* [HTML Color Codes](http://htmlcolorcodes.com/)
* [CSS Gradient](https://cssgradient.io/)
* [HTML Colors](https://htmlcolors.com/)
* [Gradnts](https://gradnts.co/)

PRs are welcome!

## Contributors

* [Juho Vepsäläinen](https://github.com/bebraw) - Core
* [Esa-Matti Suuronen](https://github.com/epeli) -
  [Grunt](https://github.com/cowboy/grunt) support + removeAllListeners
* [Peter Müller](https://github.com/Munter) -
  [one.color](https://github.com/One-com/one-color) + HTML tweaks
* [Edmundas Kondrašovas](https://github.com/edmundask) - Callback `done` fix
* [Fabio Caseri](https://github.com/fabiocaseri) - Use hex code instead of `black`
* [Artem Zakharchenko](https://github.com/blackrabbit99) - Fix issue with initial color when it was set black on RGB (#20).
* [Tyler Waters](https://github.com/tswaters) - Improve CSS to work with IE better. Ensure `done` callback is fired for extras. Add validation to extra fields to avoid exceptions from one-color.
* [Elsa Balderrama](https://github.com/Lexas) - Trigger `done` correctly for alpha slider.
* [Jesse Keane](https://github.com/jarofghosts) - Add `onecolor` to `package.json` so that colorjoe works with Browserify
* [Sam Potts](https://github.com/SamPotts) - Improve formatting, generate random ids for labels, IE9+ support.
* [Mirza Zulfan](https://github.com/mirzazulfan) - Logo. #48, #49
* [Andreas Lind](https://github.com/papandreou) - Port build to rollup. #47

## Hacking

1. `npm i`
2. `npm start`
3. `serve` (or similar command) at project root


## License

colorjoe is available under MIT. See [LICENSE](https://github.com/bebraw/colorjoe/blob/master/LICENSE) for more details.
