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
            'default': {
                src: [
                    'node_modules/dragjs/dist/dragjs.js',
                    'src/utils.js',
                    'src/extras.js',
                    'src/<%= pkg.name %>.js'
                ],
                dest: '<%= dirs.dest %>.js'
            }
        },
        umd: {
            'default': {
                src: '<%= dirs.dest %>.js',
                objectToExport: '<%= pkg.name %>',
                globalAlias: '<%= pkg.name %>',
                deps: {
                    'default': ['onecolor'],
                    global: ['one.color']
                }
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
                tasks: ['refresh']
            }
        }
    });

    grunt.registerTask('refresh', ['concat', 'umd', 'uglify']);
    grunt.registerTask('default', ['refresh', 'watch']);

    ['grunt-contrib-concat',
     'grunt-contrib-uglify',
     'grunt-contrib-watch',
     'grunt-umd'
    ].forEach(grunt.loadNpmTasks);
};
