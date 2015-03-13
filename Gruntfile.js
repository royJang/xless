module.exports = function (grunt){

    grunt.initConfig({
        watch : {
            xless: {
                files: ['src/**/**.less'],
                tasks: ['concat']
            },
            test : {
                files : ['test/test.less'],
                tasks : ['less']
            }
        },
        concat: {
            dist: {
                src: ['src/reset.less','src/**/**.less'],
                dest: 'dest/xLess.less'
            }
        },
        less : {
            test : {
                files: {
                    "test/test.css": "test/test.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('dev',[
        'watch'
    ]);

    grunt.registerTask('pro',[
        'concat'
    ]);
};