/*global module*/
module.exports = function(grunt) {
	'use strict';

	grunt.config('pkg', grunt.file.readJSON('package.json'));

	/*
	 * Sass: Compass (requires compass gem)
	 */
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.config('compass.options', {
		outputStyle: 'compressed',
		sassDir: 'assets/src/sass',
		cssDir: 'assets',
		imagesDir: 'assets',
		fontsDir: 'assets',
		javascriptsDir: 'assets',
		httpPath: '/extensions/folio_overrides',
	});
	grunt.config('compass.build.options', { sourcemap: true });
	grunt.config('compass.dist.options', { sourcemap: false, force: true });

	/*
	 * CSS prefixes (-moz-, -webkit-, etc.)
	 */
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.config('autoprefixer.build', {
		options: { map: true },
		files: {
			'assets/folio_overrides.css': 'assets/folio_overrides.css',
			'assets/folio_overrides.fields.css': 'assets/folio_overrides.fields.css'
		}
	});
	grunt.config('autoprefixer.dist', {
		options: { map: false },
		files: grunt.config('autoprefixer.build.files'),
	});

	/* --------------------------------
	 * Javascript
	 * -------------------------------- */

	// /*
	//  * JSHint:
	//  */
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.config('jshint', {
	// 	options: { jshintrc: './.jshintrc' },
	// 	files: ['./assets/src/js/**/*.js']
	// });

	/*
	 * Uglify
	 */
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.config('uglify.build', {
		options: {
			mangle: false,
			sourceMap: true,
			sourceMapIncludeSources: true,
			sourceMapRoot: './assets/src/js'
		},
		files: {
			'./assets/folio_overrides.fields.js': ['./assets/src/js/**/*.js']
		}
	});
	grunt.config('uglify.dist', {
		options: { sourceMap: false },
		files: grunt.config('uglify.build.files'),
	});

	/* --------------------------------
	/* favicons
	/* -------------------------------- */

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-compile-handlebars');
	grunt.loadNpmTasks('grunt-svg2png');
	/**
	 * NOTE: grunt-favicons@0.8.0 needs patching  at tasks/favicons.js:451 to:
	 * fs.unlink(path.join(f.dest, size+'.png'), function(err){if(err) throw err;});
	 */
	grunt.loadNpmTasks('grunt-favicons');

	grunt.config('paths.favicons', {
		src: 'assets/src/favicons',
		dest: 'assets/favicons',
		generated: 'assets/build/favicons',
		httpPath: '/extensions/folio_overrides',

	});
	grunt.config('clean.favicons', {
		src: [
			'<%= paths.favicons.generated %>',
			'<%= paths.favicons.dest %>',
		]
	});
	grunt.config('favicons', {
		options: {
			// debug: false,
			apple: false,
			regular: false,
			windowsTile: false,
			timestamp: true
		},
	});

	grunt.config('svg2png.sources', {
		src: [
			'<%= paths.favicons.src %>/cog.svg',
			'<%= paths.favicons.src %>/prtfl.svg'
		]
	});

	/* generate-favicons
	 * NOTE: requires `brew install imagemagick`
	 * - - - - - - - - - - - - - - - - - */
	var favTasks = ['clean:favicons'];
	var favicons = {
		black: { filename: 'profile-abstract2-black.png', color: '#000000', },
		white: { filename: 'profile-abstract2-white.png', color: '#FFFFFF', },
		prtfl: { filename: 'prtfl.png', color: '#D0021B', },
		cog: { filename: 'cog.png', color: '#000000', },
	};
	// sizes = [16, 32, 48, 64, 128, 256, 512];
	var sizes = [57, 72, 114, 120, 144, 152];

	var favObj, obj;
	for (var favName in favicons) {
		if (!favicons.hasOwnProperty(favName)) continue;

		favObj = favicons[favName];

		grunt.config('copy.svg-favicons_' + favName, {
			files: [{
				src: '<%= paths.favicons.src %>/' + favObj.filename,
				dest: '<%= paths.favicons.generated %>/' + favName + '/favicon.png',
			}]
		});

		obj = {
			templateData: [],
			globals: [{
				maskRadius: '50%',
				viewBox: '0 0 512 512',
				transform: 'translate(256, 256) scale(1.05) translate(-256, -256)'
				}],
			files: [{
				src: '<%= paths.favicons.src %>/favicon_template.hbs',
				dest: []
				}],
		};
		// NOTE: templateData.location is relative
		obj = sizes.reduce(function(acc, val, idx, arr) {
			// grunt.log.writeln('args: ' + JSON.stringify(arguments));
			acc.files[0].dest[idx] = '<%= paths.favicons.generated %>/' +
				favName + '/apple-touch-icon-' + val + 'x' + val + '.svg';
			acc.templateData[idx] = {
				location: './favicon.png',
				size: val,
			};
			return acc;
		}, obj);
		obj.files[0].dest.push('<%= paths.favicons.generated %>/' + favName + '/favicon_roundel.svg');
		obj.templateData.push({ location: './favicon.png', size: 600 });

		grunt.config('compile-handlebars.svg-wrap_' + favName, obj);

		grunt.config('svg2png.favicons_' + favName, {
			files: [
				{
					src: ['apple-touch-icon-*.svg'],
					cwd: '<%= paths.favicons.generated %>/' + favName + '/',
					dest: '<%= paths.favicons.dest %>/' + favName + '/',
				}, {
					src: ['favicon_roundel.svg'],
					cwd: '<%= paths.favicons.generated %>/' + favName + '/',
					dest: '<%= paths.favicons.generated %>/' + favName + '/',
				}
			]
		});
		grunt.config('favicons.square_' + favName, {
			options: {
				trueColor: false,
				tileColor: favObj.color,
				windowsTile: true,
				tileBlackWhite: false,
				apple: false,
				regular: false,
				html: '<%= paths.favicons.generated %>/favicon_square.html',
				HTMLPrefix: '<%= paths.favicons.httpPath %>/<%= paths.favicons.dest %>/' + favName + '/',
			},
			src: '<%= paths.favicons.generated %>/' + favName + '/favicon.png',
			dest: '<%= paths.favicons.dest %>/' + favName + '/',
		});
		grunt.config('favicons.roundel_' + favName, {
			options: {
				apple: true,
				regular: true,
				trueColor: true,
				precomposed: true,
				appleTouchBackgroundColor: favObj.color,
				appleTouchPadding: 20,
				html: '<%= paths.favicons.generated %>/' + favName + '/favicon_roundel.html',
				HTMLPrefix: '<%= paths.favicons.httpPath %>/<%= paths.favicons.dest %>/' + favName + '/',
			},
			src: '<%= paths.favicons.generated %>/' + favName + '/favicon_roundel.png',
			dest: '<%= paths.favicons.dest %>/' + favName + '/',

		});

		grunt.registerTask('build-favicons_' + favName, [
			// 'clean:favicons_' + favName,
			'copy:svg-favicons_' + favName,
			'compile-handlebars:svg-wrap_' + favName,
			'svg2png:favicons_' + favName,
			'favicons:square_' + favName,
			'favicons:roundel_' + favName,
		]);

		favTasks.push('build-favicons_' + favName);
	}
	grunt.registerTask('build-favicons', favTasks);

	/*
	 * Watch tasks
	 */
	grunt.loadNpmTasks('grunt-contrib-watch'); // Workflow
	grunt.config('watch', {
		options: {
			spawn: false,
			forever: true,
			livereload: false
		},
		'reload-config': {
			files: ['gruntfile.js'],
		},
		'process-sources': {
			files: ['assets/src/js/**/*.js'],
			tasks: ['uglify:build']
		},
		styles: {
			files: ['assets/src/sass/**/*.scss'],
			tasks: ['compass:build', 'autoprefixer:build']
		},
	});


	grunt.registerTask('buildResources', ['build-favicons']);
	grunt.registerTask('dist', ['compass:dist', 'autoprefixer:dist', /* 'jshint',*/ 'uglify:dist', 'buildResources']);
	grunt.registerTask('buildScripts', ['uglify:build']);
	grunt.registerTask('buildStyles', ['compass:build', 'autoprefixer:build']);
	grunt.registerTask('build', ['buildStyles', 'buildScripts', 'buildResources']);
	// grunt.registerTask('buildWatch', ['watch']);
	grunt.registerTask('default', ['dist']); //, 'buildWatch']);
};