module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    dir: {
      src: 'src',
      dist: 'dist',
      demo: 'demo',
      test: 'test',
      coverage: 'coverage'
    },

    openui5_preload: {
      library: {
        options: {
          resources: [
            {
              cwd: '<%= dir.src %>',
              src: [
                '**/*.js',
                '**/*.properties',
                '**/*.json'
              ]
            }
          ],
          dest: '<%= dir.dist %>'
        },
        libraries: true
      }
    },

    clean: {
      dist: '<%= dir.dist %>',
      coverage: '<%= dir.coverage %>'
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-openui5');

  // Build task
  grunt.registerTask('build', ['clean:dist', 'openui5_preload']);

  // Default task
  grunt.registerTask('default', ['build']);
};
