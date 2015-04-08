module.exports = function (grunt){

    grunt.initConfig({
        watch : {
            //xless basic
            xless: {
                files: ['src/animation/**/**.less','src/basic/**/**.less','src/components/**/**.less'],
                tasks: ['concat:xlessBasic','less:homePage']
            },
            homePage : {
                files : ['src/**/**.less','src/**/**/**.less', 'src/**/**/**.html', 'test/index.less'],
                tasks : ['less:homePage']
            }
        },  
        concat: {
            xlessBasic: {
                src: [
                    'src/basic/reset.less',
                    'src/basic/**/**.less',
                    'src/animation/**.less',
                    'src/animation/**/**.less',
                    'src/components/**.less',
                    'src/components/**/**.less'
                ],
                dest: 'dest/xLess.less'
            }
        },
        less : {
            homePage : {
                files : {
                    "test/index.css" : "test/index.less"
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