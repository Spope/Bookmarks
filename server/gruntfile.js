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
        }

    });


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'watch']);
};
