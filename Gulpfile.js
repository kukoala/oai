var gulp = require('gulp'),
	concat = require('gulp-concat-css'),
	jshint = require('gulp-jshint'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),
	browserSync = require('browser-sync').create();

/*
 * To use the gulp-image-resize, it needs of some dependencies:
 * https://www.npmjs.com/package/gulp-image-resize
 *
 * Or, install:
 *
 * Ubuntu:
 * apt-get install imagemagick
 * apt-get install graphicsmagick
 *
 * Mac:
 * brew install imagemagick
 * brew install graphicsmagick
 *
 * Windows & others:
 * http://www.imagemagick.org/script/binary-releases.php
 * */

var tinypngToken = 'hHrU0V0DGG3tNna6R1sqNNOqqU-x1S4u';

var dist = {
	location: 'dist/'
};

var images = {
	content: '*.*',
	location: 'img/'
};

images.largePhotos = {
	content: '*.*',
	location: images.location + 'largePhotos/'
};

var cssfiles = 'css/*.css',
	imgfiles = 'img/*',
	jsfiles = 'js/*.js';

imgfiles = 'img/*';

gulp.task('oai', function() {
	gulp.src(cssfiles)
		.pipe(concat('oai.css'))
		.pipe(gulp.dest('dist/css'));
	gulp.src('dist/css/oai.css')
		.pipe(minifycss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('minifyCss', function () {
	gulp.src('dist/css/oai.css')
		.pipe(minifycss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
	gulp.src(jsfiles)
			.pipe(jshint())
			.pipe(jshint.reporter('default'))
			.pipe(gulp.dest('dist/js'));
	gulp.src(['dist/js/dist.js'])
			.pipe(rename({
				extname: '.min.js'
			}))
			.pipe(uglify({
				preserveComments: 'some'
			}))
			.pipe(gulp.dest('dist/js'));
});

gulp.task('resizeLargePhotos', function () {
	gulp.src(images.largePhotos.location + images.largePhotos.content)
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.location + images.largePhotos.location));
});

gulp.task('tinyImages', function () {
	gulp.src(images.location + 'src/' + images.content)
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(images.location));
});

gulp.task('tinyLargePhotos', function () {
	gulp.src(images.largePhotos.location + images.largePhotos.content)
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(images.largePhotos.location));
});

gulp.task('tiny', ['tinyImages', 'tinyLargePhotos']);

gulp.task('watch', function () {
	gulp.watch(cssfiles, ['oai']);
});

gulp.task('oai-watch', ['oai'], function () {
	browserSync.reload();
});

// Watch scss AND html files, doing different things with each.
gulp.task('serve', ['oai'], function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch(cssfiles, ['oai-watch']);
	gulp.watch("*.html").on("change", browserSync.reload);

});

gulp.task('default', ['serve']);