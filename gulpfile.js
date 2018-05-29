var gulp = require('gulp');

gulp.task('default', defaultTask);

function defaultTask(done) {
  // place code for your default task here
  gulp.src('projects/stooges/src/assets/stooges/**')
  .pipe(gulp.dest('projects/admin/src/assets/stooges'));
  done();
}