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
					'build/booking-search.jsp': 'src/html/booking-search.jade',
					'build/booking-results.jsp': 'src/html/booking-results.jade',
					'build/booking-services.jsp': 'src/html/booking-services.jade',
					'build/booking-billing.jsp': 'src/html/booking-billing.jade',
					'build/booking-complete.jsp': 'src/html/booking-complete.jade',
					'build/featured.jsp': 'src/html/featured.jade',
					'build/login.jsp': 'src/html/login.jade',
					'build/register.jsp': 'src/html/register.jade',
					'build/dashboard.jsp': 'src/html/dashboard.jade',
					
					'build/checkout.jsp': 'src/html/checkout.jade',

					'build/imprint.html': 'src/html/imprint.jade',
					'build/privacy.html': 'src/html/privacy.jade',					
					
					'build/sc-admin.jsp': 'src/html/sc-admin.jade',
					'build/sc-index.jsp': 'src/html/sc-index.jade',
					'build/sc-contact.jsp': 'src/html/sc-contact.jade',
					'build/sc-cancellations.jsp': 'src/html/sc-cancellations.jade',
					'build/sc-complaints.jsp': 'src/html/sc-complaints.jade',
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
					'build/css/booking.built.css': "src/less/pages/booking.less",
					'build/css/featured.built.css': ["src/less/pages/featured.less", "src/less/promo-article.less"],
					'build/css/login.built.css': ["src/less/pages/login.less"],
					'build/css/dashboard.built.css': ["src/less/pages/dashboard.less"],
					'build/css/support-center.built.css': ["src/less/pages/support-center.less"],
					'build/css/checkout.built.css': ["src/less/pages/checkout.less"],
					'build/css/modal.built.css': ["src/less/modal.less"],
					'build/css/flag.built.css': ["src/less/flag.less"],
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
	grunt.loadNpmTasks('grunt-newer');
	grunt.registerTask('default', ['newer:jade', 'newer:less', 'newer:copy']);
};