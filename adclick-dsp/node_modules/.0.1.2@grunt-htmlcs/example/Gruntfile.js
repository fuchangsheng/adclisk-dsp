module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    htmlcs: {
      all: {
        files: {
          src: ['src/{,**/}*.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-htmlcs');

  grunt.registerTask('default', 'htmlcs');
};
