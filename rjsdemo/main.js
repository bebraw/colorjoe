requirejs.config({
    paths: {
        onecolor: '../js/onecolor' // important! colorjoe depends on this
    }
});

requirejs(['../dist/colorjoe'], function(colorjoe) {
    var val = document.getElementById('rgbValue');

    colorjoe.rgb('rgbPicker').on('change', function(c) {
        val.innerHTML = c.css();
    });
});
