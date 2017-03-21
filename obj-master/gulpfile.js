

const gulp   = require('gulp');
const uglify = require('gulp-uglify');

gulp.task('default', function() {
    gulp.src('src/obj.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'));
    //...
    console.log('Is ok .')
});