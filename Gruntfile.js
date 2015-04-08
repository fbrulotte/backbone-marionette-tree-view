fs = require('fs');
_ = require('underscore');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      all: {
        options: {
          paths: ['src/less']
        },
        files: {
          'dist/marionette-tree-view.css': 'src/less/main.less'
        }
      }
    },

    clean: ['dist'],

    cssmin: {
      all: {
        files: {
          'dist/marionette-tree-view.min.css': 'dist/marionette-tree-view.css'
        }
      }
    },

    mince: {
      main: {
        options: {
          include: ["src/js"]
        },
        files: [{
          src: ["src/js/node.js", "src/js/tree.js"],
          dest: "dist/marionette-tree-view.js"
        }]
      }
    },

    uglify: {
      main: {
        options: {
          compress: true,
          mangle: true,
          screwIE8: true
        },
        files: {
          'dist/marionette-tree-view.min.js': [
            'src/js/node.js',
            'src/js/tree.js'
          ]
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true
      },
      all: ['src/js/**/*.js']
    },

    karma: {
      all: {
        hostname: '127.0.0.1',
        client: { captureConsole: true },
        options: {
          logLevel: 'INFO',
          browsers: ['Firefox'],
          frameworks: ['jasmine'],
          reporters: ['progress'],
          singleRun: true,
          background: false,
          captureConsole: true,
          files: [
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/underscore/underscore-min.js",
            "node_modules/backbone/backbone-min.js",
            "node_modules/backbone.marionette/lib/backbone.marionette.min.js",
            "dist/marionette-tree-view.min.js",
            'test/unit/libs/jasmine-jquery.js',
            'dist/marionette-tree-view.js',
            'test/unit/spec/**/*.js']
        }
      }
    },

    protractor: {
      all: {
        options: {
          configFile: 'test/e2e/config.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mincer');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('default',  ['clean', 'less', 'jshint', 'mince', 'uglify', 'cssmin']);
  grunt.registerTask('test',  ['karma']);
};