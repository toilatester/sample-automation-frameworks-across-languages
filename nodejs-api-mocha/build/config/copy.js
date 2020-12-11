const gulp = require('gulp');
const path = require('path');

const appRootPath = path.join(path.resolve(__dirname), '..', '..');
const destinationFolder = path.join(appRootPath, 'dist');
gulp.task('copyResFilesToDist', () => {
  return gulp
    .src([`${appRootPath}/package.json`, `${appRootPath}/README.md`, `${appRootPath}/index.js`])
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('copyCoreFilesToDist', () => {
  return gulp.src([`${appRootPath}/core/**/*`]).pipe(gulp.dest(`${destinationFolder}/core`));
});

gulp.task('copyServicesFilesToDist', () => {
  return gulp.src([`${appRootPath}/services/**/*`]).pipe(gulp.dest(`${destinationFolder}/services`));
});

gulp.task('copyDataFilesToDist', () => {
  return gulp.src([`${appRootPath}/data/**/*`]).pipe(gulp.dest(`${destinationFolder}/data`));
});

gulp.task('copyUtilsFilesToDist', () => {
  return gulp.src([`${appRootPath}/utils/**/*`]).pipe(gulp.dest(`${destinationFolder}/utils/`));
});

gulp.task('copyConfigFilesToDist', () => {
  return gulp.src([`${appRootPath}/config/**/*`]).pipe(gulp.dest(`${destinationFolder}/config/`));
});
