const packageJson = require('./package.json');

const del = require('del');
const gulp = require('gulp');
const sequence = require('gulp-sequence');
const ts = require('gulp-typescript');
const gulpCopy = require('gulp-copy');

const dest = './dist/';

gulp.task('clean', function () {
	return del([dest, './html/js/', './html/css/', './html/images/']);
});

gulp.task('compile-ts', function (cb) {
	const tsProject = ts.createProject('./tsconfig.json');
	tsProject.options.module = 1;	// commonjs
	// tsProject.options.outDir = dest;
	return gulp.src(['./typings/index.d.ts', './src/**/*.ts'])
		.pipe(tsProject())
		.pipe(gulp.dest(dest));
});

gulp.task('compile-ts-umd', function (cb) {
	const tsProject = ts.createProject('./tsconfig.json');
	tsProject.options.module = 3;	// umd
	// tsProject.options.outDir = dest;
	return gulp.src(['./typings/index.d.ts', './src/**/*.ts'])
		.pipe(tsProject())
		.pipe(gulp.dest(dest + 'umd/'));
});

gulp.task('copy-css', function () {
	return gulp.src(['./html-d/css/**/*'])
		.pipe(gulp.dest('./html/css/'));
});

gulp.task('copy-images', function () {
	return gulp.src(['./html-d/images/**/*'])
		.pipe(gulp.dest('./html/images/'));
});

gulp.task('default', function (cb) {
	sequence('clean', 'compile-ts', 'webpack', 'copy-css', 'copy-images', cb);
});

gulp.task('webpack', function (cb) {
	let dest = './html/js/';
	const path = require('path');
	const ws = require('webpack-stream');
	const babel = require('gulp-babel');
	const named = require('vinyl-named');
	const uglyfly = require('gulp-uglyfly');
	const wp = ws.webpack;
	const commons = new wp.optimize.CommonsChunkPlugin({
		name: 'fl',
		minChunks: function (module, count) {
			// return count > 10 || /state-machine|nools-ts|@feidao[\/|\\]|feidao-\D/.test(module.request);
			return /lodash-ts/.test(module.request);
		}
	});

	return gulp.src(['./dist/pages/*.js'])
		.pipe(named())
		.pipe(ws({
			plugins: [commons],
			externals: [
				'$', 'Zepto', 'jweixin', 'wx'
			],
			output: {
				publicPath: dest,
				// libraryTarget: 'umd',
				// umdNamedDefine: true
			},
			resolve: {
				extensions: ["", ".webpack.js", '.web.js', ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
				root: [
					path.resolve('./'),
					path.resolve('./node_modules')
				],
				alias: {
					// 'wx': 'jweixin',
					'weui': 'weui.js',
					'dot': 'dot/doT.js'
				}
			},
			module: {
				// Disable handling of unknown requires
				// unknownContextRegExp: /$^/,
				// unknownContextRegExp: /c00001/,
				unknownContextCritical: true,

				// Disable handling of requires with a single expression
				exprContextRegExp: /$^/,
				exprContextCritical: false,

				// Warn for every expression in require
				wrappedContextCritical: true,
				loaders: [
					// { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: {/*presets:['es2015']*/}, plugins: ['transform-runtime']},	// error here: Error: The node API for `babel` has been moved to `babel-core`.
					{
						test: /\.(hson|json)$/,
						loader: 'hson'
					}, {
						test: /\.(tpl|nools|md|ts)$/,
						loader: 'raw'
					}
				]
			}
		}))
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-es5-property-mutators', 'transform-jscript']
		}))
		.pipe(uglyfly())
		.pipe(gulp.dest(dest));
});

gulp.task('watch-ts', function (cb) {
	return gulp.watch(['./src/**/*.ts'], ['compile-ts-umd']);
});

gulp.task('dev', ['compile-ts-umd', 'watch-ts', 'browser-sync']);

// Static server
gulp.task('browser-sync', function () {
	const browserSync = require('browser-sync').create();
	browserSync.init({
		files: ['./dist/umd/', './html-d/'],
		server: {
			baseDir: "./html-d/",
			directory: true
		},
		serveStatic: ['./'],
		port:8000
	});
});

// Static server
gulp.task('test', function () {
	const browserSync = require('browser-sync').create();
	browserSync.init({
		files: ['./html/'],
		server: {
			baseDir: "./html/",
			directory: true
		},
		serveStatic: ['./']
	});
});