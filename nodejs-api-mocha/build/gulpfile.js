const gulp = require('gulp');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');

(function build() {
  requireDir('./config');

  gulp.task('buildLibrary', (done) => {
    runSequence(
      'cleanDist',
      [
        'copyResFilesToDist',
        'copyCoreFilesToDist',
        'copyServicesFilesToDist',
        'copyDataFilesToDist',
        'copyUtilsFilesToDist',
        'copyConfigFilesToDist',
        'bundleLibrary'
      ],
      'cleanDist',
      done
    );
  });

  gulp.task('default', (done) => {
    runSequence(
      'cleanDist',
      [
        'copyResFilesToDist',
        'copyCoreFilesToDist',
        'copyServicesFilesToDist',
        'copyDataFilesToDist',
        'copyUtilsFilesToDist',
        'copyConfigFilesToDist',
        'bundleLibrary'
      ],
      'cleanDist',
      done
    );
  });
}());
