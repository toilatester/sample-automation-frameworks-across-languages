const gulp = require('gulp');
const shell = require('gulp-shell');
const path = require('path');

const appRootPath = path.join(path.resolve(__dirname), '..', '..');
const destinationFolder = path.join(appRootPath, 'dist');

gulp.task('bundleLibrary', shell.task([`npm pack ${destinationFolder}`]));
