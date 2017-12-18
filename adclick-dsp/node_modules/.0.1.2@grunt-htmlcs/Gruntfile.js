module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jscs: {
      all: [
          'Gruntfile.js',
          'tasks/htmlcs.js',
          'example/Gruntfile.js'
      ],
      options: {
        config: '.jscsrc',
        fix: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('lint', ['jscs']);
  grunt.registerTask('default', 'lint');
};
