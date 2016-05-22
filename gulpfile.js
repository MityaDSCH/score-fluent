var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var del = require('del');

const config = {
  serverPort: 8000,
  paths: {
    dist: './dist',
    serverDist: './dist/server',
    server: './src/server/**/*',
    serverDir: './src/server',
    package: './package.json',
    packageDist: './dist/package.json'
  }
}

gulp.task('clean-dist', function() {
  return del([
    config.paths.serverDist,
    config.paths.packageDist
  ]);
});

gulp.task('copy-server', function() {
  gulp.src(config.paths.server)
    .pipe(gulp.dest(config.paths.serverDist));
  gulp.src(config.paths.package)
    .pipe(gulp.dest(config.paths.dist))
});

gulp.task('copy-npm', () => {
  gulp.src(config.paths.package)
      .pipe(gulp.dest(config.paths.dist))
});

gulp.task('nodemon', () => {
  nodemon({
    env: { 'NODE_ENV': 'development' },
    script: 'dist/server/main.js',
    watch: config.paths.serverDir,
    ext: 'js',
    tasks: ['copy-server']
  }).on('restart', function () {
    console.log('Server Updated')
  });
});

gulp.task('build-server', ['clean-dist', 'copy-server', 'copy-npm']);

gulp.task('dev-server', ['build-server', 'nodemon']);
