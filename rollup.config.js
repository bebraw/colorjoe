const fs = require('fs');
const pathModule = require('path');

const pkg = require('./package.json');

const now = new Date();
const yyyymmdd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

const config = {
  input: 'src/colorjoe.js',
  output: {
    file: 'dist/colorjoe.js',
    name: 'colorjoe',
    format: 'umd',
    sourcemap: true,
    banner: `/*! ${pkg.name} - v${pkg.version} - ${pkg.author} - ${pkg.license}\n${pkg.homepage} - ${yyyymmdd} */`
  },
  watch: {
    paths: 'src/**'
  },
  plugins: [
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-node-resolve')()
  ]
};

const minifiedConfig = {
  ...config,
  output: {
    ...config.output,
    file: 'dist/colorjoe.min.js',
  },
  plugins: [
    ...config.plugins,
    require('rollup-plugin-uglify').uglify({
      output: {
        comments(node, comment) {
          return /^!|@preserve|@license|@cc_on/i.test(comment.value);
        }
      }
    })
  ]
};

module.exports = [
  config,
  minifiedConfig
];
