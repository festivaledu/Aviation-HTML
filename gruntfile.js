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
					'build/index.jsp': 'src/html/index.jade',
					'build/search.jsp': 'src/html/search.jade',
					'build/featured.jsp': 'src/html/featured.jade',
					'build/login.jsp': 'src/html/login.jade',
					'build/register.jsp': 'src/html/register.jade',
					'build/dashboard.jsp': 'src/html/dashboard.jade',
					
					
					'build/sc-index.jsp': 'src/html/sc-index.jade',
                    'build/sc-contact.jsp': 'src/html/sc-contact.jade',
                    'build/sc-cancellations.html': 'src/html/sc-cancellations.jade',
                    'build/sc-complaints.html': 'src/html/sc-complaints.jade',
                    'build/sc-rights.html': 'src/html/sc-rights.jade'
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
					
					'build/css/components/calendar.css': ["src/less/calendar.less"],
					
					'build/css/landing.built.css': ["src/less/pages/landing.less", "src/less/promo-article.less"],
					'build/css/search.built.css': "src/less/pages/search-results.less",
					'build/css/featured.built.css': "src/less/pages/featured.less",
					'build/css/login.built.css': ["src/less/pages/login.less"],
					'build/css/dashboard.built.css': ["src/less/pages/dashboard.less"],
					'build/css/support-center.built.css': ["src/less/pages/support-center.less"],
				}
			}
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        src: 'img/*',
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        src: 'js/*',
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        src: 'lib/*',
                        dest: 'build/'
					},
					{
						expand: true,
						cwd: 'out/',
						src: '*',
						dest: 'build'
					}
                ]
            }
        }
	});

    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.registerTask('default', ['jade', 'less', 'copy']);
};