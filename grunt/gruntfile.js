module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      build: {
        src: 'iElevator.js',
        dest: 'build/iElevator.min.js'
      }
    }
  });
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);

};