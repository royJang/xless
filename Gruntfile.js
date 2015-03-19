module.exports = function (grunt){

    //'src/reset.less',

    grunt.initConfig({
        watch : {
            xless: {
                files: ['src/**/**.less'],
                tasks: ['concat:dist']
            },
            test : {
                files : ['src/**/**.less','test/test.less'],
                tasks : ['less:test']
            }
        },
        concat: {
            dist: {
                src: [
                    'src/reset.less',
                    'src/mixins/**.less',
                    'src/resource/**.less',
                    'src/animation/**.less',
                    'src/animation/**/**.less'
                ],
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