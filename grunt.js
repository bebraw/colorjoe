/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.6.1',
      banner: '/*! colorjoe - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://bebraw.github.com/colorjoe/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Juho Vepsäläinen; Licensed MIT */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
              'node_modules/drag.js/src/drag.js',
              'node_modules/onecolor/one-color-all-debug.js',
              'src/elemutils.js',
              'src/extras.js',
              'src/colorjoe.js'],
        dest: 'dist/colorjoe.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/colorjoe.min.js'
      }
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'concat min'
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
