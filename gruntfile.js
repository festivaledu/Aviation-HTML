module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jade: {
			compile: {
				options: {
					pretty: "\t",
					data: {
						debug: false,
						pretty: "\t"
					}
				},
				files: {
					'build/index.html': 'src/html/index.jade',
					'build/search.html': 'src/html/search.jade',
					'build/login.html': 'src/html/login.jade',
					'build/user-cp.html': 'src/html/user-cp.jade'
				}
			}
		},
		less: {
			options: {
				javascriptEnabled: true
			},
			build: {
				files: {
					'build/css/aviation.css': ["src/less/style.less", "src/less/grid.less", "src/less/nav.less", "src/less/section.less", "src/less/button.less", "src/less/footer.less"],
					'build/css/landing.built.css': ["src/less/landing.less", "src/less/promo-article.less"],
					'build/css/search.built.css': "src/less/search-results.less",
					'build/css/login.built.css': ["src/less/login.less"],
					'build/css/user-cp.built.css': ["src/less/user-cp.less"]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.registerTask('default', ['jade', 'less']);
};