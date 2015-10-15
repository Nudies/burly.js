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
			files: ['<%= pkg.name %>.js'],
			tasks: ['jshint', 'uglify'],
			options: {
				spawn: false,
			}
		}

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'jshint']);

};
