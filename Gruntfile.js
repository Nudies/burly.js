module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', '<%= pkg.name %>.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: ['<%= pkg.name %>.js', 'test/*.js'],
      tasks: ['jshint', 'uglify', 'qunit'],
      options: {
        spawn: false,
      }
    },
    qunit: {
      all: ['test/*.html']
    },
    githooks: {
      all: {
        'pre-commit': 'jshint uglify qunit'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', ['uglify', 'jshint', 'qunit', 'githooks']);

};
