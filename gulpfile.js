var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var del = require('del');

const config = {
  serverPort: 8000,
  paths: {
    dist: './dist',
    serverDist: './dist/server',
    server: './src/server/**/*',
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

gulp.task('copy-server', ['del-server'], function() {
  gulp.src(config.paths.server)
    .pipe(gulp.dest(config.paths.serverDist));
});

gulp.task('nodemon', ['copy-server'], () => {
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

// ----------------------------------------------------------------------------
// Compose tasks
// ----------------------------------------------------------------------------

gulp.task('default', ['nodemon']);
