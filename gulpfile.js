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

gulp.task('clean-dist', function() {
  return del([
    config.paths.serverDist
  ]);
});

gulp.task('copy-server', function() {
  gulp.src(config.paths.server)
    .pipe(gulp.dest(config.paths.serverDist));
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

gulp.task('build-server', ['clean-dist', 'copy-server']);

gulp.task('dev-server', ['build-server', 'nodemon']);
