'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('htmlcs', 'HTML Code Style checker', function() {
    var htmlcs = require('htmlcs');

    this.filesSrc.map(function(path) {
      var hints = htmlcs.hintFile(path);

      if (hints.length) {
        grunt.log.error(path);

        hints.forEach(function(item) {
          // jscs:disable requireDotNotation
          grunt.log.write('[%s] line ', item.type);
          grunt.log.write('%d'['cyan'], item.line);
          grunt.log.write(', column ');
          grunt.log.write('%d'['cyan'], item.column);
          grunt.log.writeln(': %s (%s, %s)',
            item.message,
            item.rule,
            item.code
          );
          // jscs:enable requireDotNotation
        });

        grunt.fail.warn('htmlcs (HTML lint) error in file');
      }
    });
  });
};
