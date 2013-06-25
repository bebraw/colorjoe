module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            dest: 'dist/<%= pkg.name %>'
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= pkg.author %> - <%= pkg.license %>\n' +
                    '<%= pkg.homepage %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            basic: {
                src: [
                    'node_modules/drag.js/dist/drag.js',
                    'node_modules/onecolor/one-color-all-debug.js',
                    'src/elemutils.js',
                    'src/extras.js',
                    'src/<%= pkg.name %>.js'
                ],
                dest: '<%= dirs.dest %>.js'
            }
        },
        uglify: {
            'default': {
                files: {
                    '<%= dirs.dest %>.min.js': '<%= dirs.dest %>.js'
                }
            }
        },
        watch: {
            scripts: {
                files: 'src/**/*.js',
                tasks: ['concat:basic', 'uglify']
            }
        }
    });

    grunt.registerTask('refresh', ['concat:basic', 'uglify']);
    grunt.registerTask('default', ['concat:basic', 'uglify', 'watch']);

    ['grunt-contrib-concat',
     'grunt-contrib-uglify',
     'grunt-contrib-watch'
    ].forEach(grunt.loadNpmTasks);
};
