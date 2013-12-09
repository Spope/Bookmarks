module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    //paths: ["../client/public/less"]
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
        concat: {
            
            options: {
                separator: ';',
            },
            static: {
                src: [
                    '../client/public/bower/jquery/jquery.min.js',
                    '../client/public/bower/jquery-ui/ui/minified/jquery-ui.min.js',
                    '../client/public/bower/jquery-ui/ui/minified/jquery.ui.sortable.min.js',
                    '../client/public/bower/angular/angular.min.js',
                    '../client/public/bower/crossfilter/crossfilter.min.js',
                    '../client/public/js/plugin/bootstrap/modal.js',
                    '../client/public/js/plugin/isotope/isotope.js',
                    '../client/public/js/plugin/isotope/masonryCentered.js',
                    ],
                dest: '../client/public/build/js/static.js',
            },
            app: {
                src: [
                    '../client/public/js/App/init.js',
                    '../client/public/js/App/Directive/*',
                    '../client/public/js/App/Filter/*',
                    '../client/public/js/App/Service/*',
                    '../client/public/js/App/Factory/*',
                    '../client/public/js/App/Controller/*',
                    '../client/public/js/App/app.js',
                    '../client/public/js/App/View/templates.js',
                    ],
                dest: '../client/public/build/js/app.js',
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    '../client/public/build/js/static.min.js': '../client/public/build/js/static.js',
                    '../client/public/build/js/app.min.js': '../client/public/build/js/app.js'
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
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('compile', ['ngtemplates', 'concat', 'uglify']);
};
