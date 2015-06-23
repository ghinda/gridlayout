'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('assemble');

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
          'build/{,*/}*.html',
          '*.js',
          'test/*.js',
          '*.css'
        ]
      },
      jshint: {
        files: [
          'src/*.js',
          'test/{,*/}*.js'
        ],
        tasks: [ 'jshint' ]
      },
      stylus: {
        files: [
          'src/*.styl'
        ],
        tasks: [ 'stylus:server' ]
      },
      assemble: {
        files: [
          'site/{,*/}*.{hbs,html}'
        ],
        tasks: [ 'assemble' ]
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
              mountFolder(connect, './'),
              mountFolder(connect, './build/'),
              mountFolder(connect, './site/')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, './'),
              mountFolder(connect, './build/'),
              mountFolder(connect, './site/')
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
      options: {
        compress: false
      },
      server: {
        files: {
          'gridlayout.css': 'src/gridlayout.styl'
        }
      },
      dist: {
        options: {
          compress: true,
        },
        files: {
          'gridlayout.min.css': 'src/gridlayout.styl'
        }
      }
    },
    uglify: {
      server: {
        options: {
          compress: false,
          mangle: false,
          beautify: {
            indent_level: 2,
            beautify: true
          }
        },
        files: {
          'gridlayout-ie.js': 'src/gridlayout-ie.js'
        }
      },
      dist: {
        files: {
          'gridlayout-ie.min.js': 'src/gridlayout-ie.js'
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
    },
    assemble: {
      options: {
        layoutdir: 'site/layouts'
      },
      site: {
        files: [{
          expand: true,
          cwd: 'site',
          src: '{,*/}*.hbs',
          dest: 'build'
        }]
      }
    },
    clean: {
      site: {
        src: [
          'build/'
        ]
      }
    },
    copy: {
      site: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'site/*',
              '!site/**/*.{html,hbs}'
            ],
            dest: 'build/'
          }
        ]
      }
    },
    buildcontrol: {
      options: {
        dir: 'build',
        commit: true,
        push: true
      },
      site: {
        options: {
          remote: 'git@github.com:ghinda/gridlayout.git',
          branch: 'gh-pages'
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
      'stylus:server',
      'clean',
      'assemble',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'connect:dist',
    'saucelabs-jasmine'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'uglify',
    'stylus',
    'clean',
    'assemble',
    'copy'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'buildcontrol'
  ]);

};
