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
          '{,site/**/}*.css',
          '{,test/**/,site/**/,src/}*.js'
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
          'site/{,*/}*.{hbs,html,md}'
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
              mountFolder(connect, './build/'),
              mountFolder(connect, './src/'),
              mountFolder(connect, './site/'),
              mountFolder(connect, './')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, './build/')
            ];
          }
        }
      },
      test: {
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
          preserveComments: 'all',
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
              browserName: 'chrome',
              platform: 'Linux',
              version: 'dev'
            }, {
              browserName: 'firefox',
              platform: 'Linux',
              version: '40.0'
            }, {
              browserName: 'opera',
              platform: 'Linux',
              version: '12.15'
            }, {
              browserName: 'android',
              platform: 'Linux',
              version: '4.0'
            }, {
              browserName: 'android',
              platform: 'Linux',
              version: '5.1'
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
              browserName: 'microsoftedge',
              platform: 'Windows 10',
              version: '20.10240'
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
        layoutdir: 'site/layouts',
        partials: 'site/partials/*.md'
      },
      site: {
        files: [{
          expand: true,
          cwd: 'site',
          src: '{,*/}*.{hbs,md}',
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
            cwd: 'site/',
            src: [
              '**/*',
              '!**/*.{html,hbs,md}'
            ],
            dest: 'build/'
          },
          {
            expand: true,
            src: [
              'bower_components/**/*'
            ],
            dest: 'build/'
          },
          {
            expand: true,
            src: [
              'gridlayout*'
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
    'connect:test',
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
