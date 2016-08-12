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
    serverDir: './src/server',
    proc: './Procfile',
    npm: './package.json'
  }
}

// ----------------------------------------------------------------------------
// Delete, copy, and watch server
// ----------------------------------------------------------------------------

gulp.task('del-server', function() {
  return del([
    config.paths.serverDist,
    config.paths.dist + '/Procfile',
    config.paths.dist + '/package.json'
  ]);
});

gulp.task('build-server', ['del-server'], function() {
  gulp.src(config.paths.proc).pipe(gulp.dest(config.paths.dist));
  gulp.src(config.paths.npm).pipe(gulp.dest(config.paths.dist));
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
