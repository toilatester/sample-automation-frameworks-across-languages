const gulp = require('gulp');
const path = require('path');
const del = require('del');

const appRootPath = path.join(path.resolve(__dirname), '..', '..');
const destinationFolder = path.join(appRootPath, 'dist');
gulp.task('cleanDist', () => {
  return del(destinationFolder, { force: true });
});
