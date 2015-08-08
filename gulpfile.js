var gulp = require('gulp');

var jshint = require('gulp-jshint');
var babel = require('gulp-babel');

gulp.task('compile', function() {
	return gulp.src("client/scripts/src/gallery.jsx")
    .pipe(babel())
    .pipe(gulp.dest("client/scripts/build/"));
});

gulp.task('lint', function() {
	return gulp.src('server.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('watch', function() {
	gulp.watch('server.js', ['lint']);
});