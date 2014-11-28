/*global module*/
module.exports = function (grunt) {
	"use strict";

	// grunt.initConfig({});
	grunt.config("pkg", grunt.file.readJSON("package.json"));

	/*
	 * Sass: Using Compass compiler (requires gem)
	 */
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.config("compass.options", {
		sourcemap: true,
		outputStyle: "compressed",
		sassDir: "assets/src/sass",
		cssDir: "assets",
		imagesDir: "assets",
		fontsDir: "assets",
		javascriptsDir: "assets",
		httpPath: "/extensions/local_overrides",
	});
	grunt.config("compass.styles", {});
	// grunt.config("compass.styles.options.sassDir", "assets/src/sass");

	/*
	 * CSS prefixes (-moz-, -webkit-, etc.)
	 */
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.config("autoprefixer.options.map", true);
	grunt.config("autoprefixer.styles.files", {
		"assets/local_overrides.css": "assets/local_overrides.css",
		"assets/local_overrides.fields.css": "assets/local_overrides.fields.css"
	});

	/* --------------------------------
	 * Javascript
	 * -------------------------------- */

	/*
	 * jshint: code quality check
	 */
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.config("jshint", {
		options: {
			jshintrc: "./.jshintrc"
		},
		files: [
			"assets/src/js/**/*.js"
		]
	});

	/*
	 * Uglyfy
	 */
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.config("uglify", {
		build: {
			options: {
				mangle: false,
				sourceMap: true,
			},
			files: {
				"assets/local_overrides.fields.js": ["assets/local_overrides.fields.js"]
			}
		},
	});

	/*
	 * Watch tasks
	 */
	grunt.loadNpmTasks("grunt-contrib-watch"); // Workflow
	grunt.config("watch", {
		options: {
			livereload: false,
			spawn: false,
			forever: true
		},
		"reload-config": {
			files: ["gruntfile.js"],
		},
		"process-sources": {
			files: ["assets/src/js/**/*.js"],
			tasks: ["jshint", "uglify:build"]
		},
		"process-build": {
			files: ["assets/*.js"],
			tasks: [],
			// files: ["assets/local_overrides*.js"],
			// options: { livereload: false }
		},
		styles: {
			files: ["assets/src/sass/**/*.scss"],
			tasks: ["compass:styles", "autoprefixer:styles"]
		},
	});

	grunt.registerTask("buildWatch", 	["watch"]);
	grunt.registerTask("buildScripts", 	["jshint", "uglify:build"]);
	grunt.registerTask("buildStyles", 	["compass:styles", "autoprefixer:styles"]);
	grunt.registerTask("build", 		["buildStyles", "buildScripts"]);
	grunt.registerTask("default", 		["build"]);
};
