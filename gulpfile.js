var gulp = require('gulp');
var webpack = require('webpack-stream');
var nodemon = require('gulp-nodemon');
var del = require('del');

const config = {
  serverPort: 8000,
  paths: {
    dist: './dist',
    serverDist: './dist/server',
    serverEntry: './src/server/main.js',
    serverDir: './src/server'
  }
}

// ----------------------------------------------------------------------------
// Delete, copy, and watch server
// ----------------------------------------------------------------------------

gulp.task('del-server', function() {
  return del([
    config.paths.serverDist
  ]);
});

gulp.task('build-server', ['del-server'], function() {
  return gulp.src(config.paths.serverEntry)
    .pipe(webpack(require('./webpack.server.config')))
    .pipe(gulp.dest(config.paths.serverDist));
});

gulp.task('watch-server', ['build-server'], () => {
  nodemon({
    env: { 'NODE_ENV': 'development' },
    script: 'dist/server/server.bundle.js',
    watch: config.paths.serverDir,
    ext: 'js',
    tasks: ['build-server']
  }).on('start', function () {
    console.log('Starting nodemon watch');
  }).on('restart', function () {
    console.log('Server Updated')
  });
});

// ----------------------------------------------------------------------------
// Compose tasks
// ----------------------------------------------------------------------------

gulp.task('default', ['watch-server']);
