/**
*@file grunt configuration file
*@author banbo777@163.com
*@version 0.1.1
*/
module.exports = function(grunt) {

	grunt.initConfig({
		//js code style check
		jshint: {
			normal: {
				src: ['*.js', 'business_system/**/*.js', 'console/**/*.js', 'management_system/**/*.js'],
				options: {
					jshintrc: true,
					force: true,
					reporter: require('jshint-stylish'),
					ignores: ['business_system/public/bootstrap/**/*.js', 'business_system/public/jquery/**/*.js', 
					  'business_system/logic/**/*.js', 'business_system/model/**/*.js']
				}
			},
			management: {
				src: ['management_system/**/*.js'],
				options: {
					jshintrc: true,
					force: true,
					reporter: require('jshint-stylish'),
					ignores: ['management_system/public/bootstrap/**/*.js', 'management_system/jquery/**/*.js',
					'management_system/utils/**/*.js']
				}
			},
			noCamelCase: {
				src: ['common/*.js', 'business_system/logic/*.js', 'business_system/model/*.js'],
				options: {
					jshintrc: true,
					force: true,
					reporter: require('jshint-stylish'),
					camelcase: true
				}
			},
			timer: {
				src: ['management_system/logic/adx/adx_timer.js'],
				options: {
					jshintrc: true,
					force: true,
					reporter: require('jshint-stylish'),
				}
			}
		},

		//html code style check
		htmllint: {
			task: {
				options: {
					force: true,
					htmllintrc: true
				},
				src: ['business_system/view/**/*.html']
			}
		},

		//css code style check
		csslint: {
			files: ['business_system/view/**/*.css', 'business_system/public/css/*.css']
		},

		//mocha test
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					quiet: false
				},
				src: ['business_system/test/*.js']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-htmllint');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('mochaTest', ['mochaTest']);
	grunt.registerTask('codeCheck', ['csslint', 'jshint', 'htmllint']);
	grunt.registerTask('default', ['jshint', 'htmllint', 'csslint']);
};
