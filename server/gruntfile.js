module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "../client/public/css/main.css" : "../client/public/less/main.less"
                }
            }
        },
        watch: {
            less: {
                files: "../client/public/less/*.less",
                tasks: ["less"],
                options: {
                    interrupt: true
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ["../client/public/css/main.css"]
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    '../client/public/build/js/static.min.js': [
                        '../client/public/bower/jquery/dist/jquery.min.js',
                        '../client/public/bower/jquery-ui/ui/minified/core.min.js',
                        '../client/public/bower/jquery-ui/ui/minified/widget.min.js',
                        '../client/public/bower/jquery-ui/ui/minified/mouse.min.js',
                        '../client/public/bower/jquery-ui/ui/minified/sortable.min.js',
                        '../client/public/bower/angular/angular.min.js',
                        '../client/public/bower/crossfilter/crossfilter.min.js',
                        '../client/public/js/plugin/bootstrap/modal.js',
                        '../client/public/js/plugin/isotope/isotope.js',
                        '../client/public/js/plugin/isotope/masonryCentered.js',
                        '../client/public/js/plugin/webFont.js',
                        '../client/public/js/plugin/fontInit.js',
                    ],
                    '../client/public/build/js/app.min.js': [
                        '../client/public/js/App/init.js',
                        '../client/public/js/App/Directive/*',
                        '../client/public/js/App/Filter/*',
                        '../client/public/js/App/Service/*',
                        '../client/public/js/App/Factory/*',
                        '../client/public/js/App/Controller/*',
                        '../client/public/js/App/app.js',
                        '../client/public/js/App/View/templates.js',
                    ]
                }
            }
        },

        
        ngtemplates: {
            app : {
                cwd: '../client/public/',
                src : "js/App/View/**/**.html",
                dest : "../client/public/js/App/View/templates.js"
            },
            options: {
                module: 'bookmarkApp',
                htmlmin: {
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          true,
                    removeComments:                 true, // Only if you don't use comment directives!
                    removeEmptyAttributes:          true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('compile', ['ngtemplates', 'uglify']);
};
