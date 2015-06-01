var gulp = require('gulp');

var jshint = require('gulp-jshint');

gulp.task('lint', function() {
	return gulp.src('server.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('watch', function() {
	gulp.watch('server.js', ['lint']);
});