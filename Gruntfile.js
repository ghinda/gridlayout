'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      grunt: {
        files: [ 'Gruntfile.js' ]
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '{,*/}*.html',
          '*.js',
          'test/*.js',
          '*.css'
        ]
      },
      jshint: {
        files: [ 
          'gridlayout-ie9.js',
          'test/{,*/}*.js'
        ],
        tasks: [ 'jshint' ]
      },
      concat: {
        files: [
          'src/*.js'
        ],
        tasks: [ 'concat' ]
      },
      stylus: {
        files: [
          'src/*.styl'
        ],
        tasks: [ 'stylus' ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'src/*.js',
        'test/*.js'
      ]
    },
    stylus: {
      all: {
        files: {
          'gridlayout.css': 'src/gridlayout.styl'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      server: {
        src: [
          'src/polyfills-ie8.js',
          'src/gridlayout-ie.js'
        ],
        dest: 'gridlayout-ie.js',
      },
    },
    uglify: {
      dist: {
        options: {
          wrap: 'gridlayoutExports'
        },
        files: {
          'gridlayout-ie.js': 'gridlayout-ie.js'
        }
      }
    },
    'saucelabs-jasmine': {
      all: {
        options: {
          urls: [ 'http://127.0.0.1:9000/test' ],
          detailedError: true,
          browsers: [
            {
              browserName: 'chrome'
            }, {
              browserName: 'firefox'
            }, {
              browserName: 'opera'
            }, {
              browserName: 'android',
              platform: 'Linux',
              version: '4'
            }, {
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '8'
            }, {
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '9'
            }, {
              browserName: 'internet explorer',
              platform: 'Windows 8',
              version: '10'
            }, {
              browserName: 'safari',
              platform: 'OS X 10.8',
              version: '6'
            }, {
              browserName: 'iphone',
              platform: 'OS X 10.8',
              version: '5'
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'connect:livereload',
      'jshint',
      'concat',
      'stylus',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'connect:dist',
    'saucelabs-jasmine'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'stylus'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
