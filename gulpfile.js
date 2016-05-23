var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require("./webpack.config.js");
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
// Webpack
// ----------------------------------------------------------------------------

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

gulp.task("webpack:dev", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    host: process.env.HOST,
    port: process.env.PORT,
    stats: {colors: true}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

// ----------------------------------------------------------------------------
// Delete, copy, and watch server
// ----------------------------------------------------------------------------

gulp.task('del-server', function() {
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

// ----------------------------------------------------------------------------
// Compose tasks
// ----------------------------------------------------------------------------

gulp.task('build-server', ['del-server', 'copy-server']);

gulp.task('watch-backend', ['build-server', 'nodemon']);

gulp.task('default', ['webpack:dev', 'watch-backend']);
