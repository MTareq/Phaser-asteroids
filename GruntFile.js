module.exports = function(grunt) {

	grunt.initConfig({
	  watch: {
		files: ['**/*'],
		tasks: ['jshint:all'],
	  },
      jshint: {
         all: ['**/*.js']
      },
      connect: {
         server:{
              options: {port: 1337,
                        hostname: '127.0.0.1',
                        liverelaod: true,
                        keepalive: true}
        }
      },
	});
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default', ['connect','watch']);
};

