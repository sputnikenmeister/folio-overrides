/*global module*/
module.exports = function(grunt) {
	"use strict";

	grunt.config("pkg", grunt.file.readJSON("package.json"));

	/*
	 * Sass: Compass (requires compass gem)
	 */
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.config("compass.options", {
		outputStyle: "compressed",
		sassDir: "assets/src/sass",
		cssDir: "assets",
		imagesDir: "assets",
		fontsDir: "assets",
		javascriptsDir: "assets",
		httpPath: "/extensions/folio_overrides",
	});
	grunt.config("compass.build.options", { sourcemap: true });
	grunt.config("compass.dist.options", { sourcemap: false, force: true });

	/*
	 * CSS prefixes (-moz-, -webkit-, etc.)
	 */
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.config("autoprefixer.build", {
		options: { map: true },
		files: {
			"assets/folio_overrides.css": "assets/folio_overrides.css",
			"assets/folio_overrides.fields.css": "assets/folio_overrides.fields.css"
		}
	});
	grunt.config("autoprefixer.dist", {
		options: { map: false },
		files: grunt.config("autoprefixer.build.files"),
	});

	/* --------------------------------
	 * Javascript
	 * -------------------------------- */

	// /*
	//  * JSHint:
	//  */
	// grunt.loadNpmTasks("grunt-contrib-jshint");
	// grunt.config("jshint", {
	// 	options: { jshintrc: "./.jshintrc" },
	// 	files: ["./assets/src/js/**/*.js"]
	// });

	/*
	 * Uglify
	 */
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.config("uglify.build", {
		options: {
			mangle: false,
			sourceMap: true,
			sourceMapIncludeSources: true,
			sourceMapRoot: "./assets/src/js"
		},
		files: {
			"./assets/folio_overrides.fields.js": ["./assets/src/js/**/*.js"]
		}
	});
	grunt.config("uglify.dist", {
		options: { sourceMap: false },
		files: grunt.config("uglify.build.files"),
	});

	/*
	 * Watch tasks
	 */
	grunt.loadNpmTasks("grunt-contrib-watch"); // Workflow
	grunt.config("watch", {
		options: {
			spawn: false,
			forever: true,
			livereload: false
		},
		"reload-config": {
			files: ["gruntfile.js"],
		},
		"process-sources": {
			files: ["assets/src/js/**/*.js"],
			tasks: ["uglify:build"]
		},
		styles: {
			files: ["assets/src/sass/**/*.scss"],
			tasks: ["compass:build", "autoprefixer:build"]
		},
	});


	grunt.registerTask("dist", ["compass:dist", "autoprefixer:dist", /* "jshint",*/ "uglify:dist"]);
	grunt.registerTask("buildScripts", ["uglify:build"]);
	grunt.registerTask("buildStyles", ["compass:build", "autoprefixer:build"]);
	grunt.registerTask("build", ["buildStyles", "buildScripts"]);
	// grunt.registerTask("buildWatch", ["watch"]);
	grunt.registerTask("default", ["dist"]); //, "buildWatch"]);
};