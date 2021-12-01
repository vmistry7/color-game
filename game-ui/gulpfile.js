"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser 
var browserify = require('browserify'); // Bundle.js
var reactify = require('reactify'); // Transforms React JSX to JS (UNUSED)
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); //Lint JS files including JSX
var server = require('gulp-express');
var babelify = require('babelify');//Transforms React JSX to JS and ES2015 to ES5

var config = {

	port: 5001,
	devBaseUrl: 'http:localhost',
	paths: {

		html: './src/*.html',
		js: './src/**/*.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css'
		],
		dist: '../game-server/dist',
		mainJs: './src/main.js'
	}
}

gulp.task('open', function(){

	gulp.src('dist/index.html')
		.pipe(open({uri: config.devBaseUrl + ':'+ config.port + '/'}));
});

gulp.task('html', function(){

	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());

});

gulp.task('js', function(){

	browserify(config.paths.mainJs)
	.transform(reactify)	//use for development on chrome 
	//.transform("babelify", {presets: ["react", "es2015"]}) //use for production (Remove 'use strict' above $ = jQuery = require('jquery');) 
	.bundle()
	.on('error', console.error.bind(console))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(config.paths.dist + '/scripts'))
	.pipe(connect.reload());
});

gulp.task('css', function(){

	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

//Right now no rules are defined.
gulp.task('lint', function(){

	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());
});

gulp.task('watch', function(){

	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);

});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
