module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    dir: {
      src: 'src',
      dist: 'dist',
      demo: 'demo/',
      test: 'test',
      coverage: 'coverage'
    },

    connect: {
      options: {
        port: 8080,
        hostname: '*'
      },
      src: {},
      dist: {}
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
    },

    copy: {
      dist: {
        expand: true,
        cwd: '<%= dir.src %>/',
        src: '**',
        dest: '<%= dir.dist %>'
      }
    },

    eslint: {
      test: ['<%= dir.test %>'],
      src: ['<%= dir.src %>']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-openui5');

  // Build task
  //grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);
  grunt.registerTask('build', ['clean:dist', 'openui5_preload']);

  // Default task
  grunt.registerTask('default', ['build']);
};
