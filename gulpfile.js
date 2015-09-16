'use strict';

require("harmonize")();

var gulp = require('gulp');
var template = require('gulp-template');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var babelify = require('babelify');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var _ = require('lodash');
var eslint = require('gulp-eslint');
var jest = require('jest-cli');
var argv = require('yargs').argv;
var server = require('./server.js').app;
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var opn = require('opn');


var config = {
    bootstrapDir: './node_modules/bootstrap-sass',
    jestOptions: {
        rootDir: 'js',
        scriptPreprocessor: '../node_modules/babel-jest',
        testFileExtensions: [
            'es6',
            'js'
        ],
        unmockedModulePathPatterns: [
            '<rootDir>/node_modules/react',
            '<rootDir>/node_modules/react-tools'
        ],
        moduleFileExtensions: [
            'js',
            'json',
            'react',
            'es6'
        ]
    },
    filesToWatch: [
        'build/css/*.css',
        'build/js/*.js'
    ]
};

var SERVER_URL = process.env.ONION_SERVER_URL || 'https://staging.ascribe.io/';

var constants = {
    BASE_URL: (function () { var baseUrl = process.env.ONION_BASE_URL || '/'; return baseUrl + (baseUrl.match(/\/$/) ? '' : '/'); })(),
    SERVER_URL: SERVER_URL,
    API_ENDPOINT: SERVER_URL + 'api/' || 'https://staging.ascribe.io/api/',
    DEBUG: !argv.production,
    CREDENTIALS: 'ZGltaUBtYWlsaW5hdG9yLmNvbTowMDAwMDAwMDAw' // dimi@mailinator:0000000000
};


gulp.task('build', ['js:build', 'sass:build', 'copy'], function() {
});

gulp.task('js:build', function() {
    bundle(false);
});

gulp.task('serve', ['browser-sync', 'run-server', 'sass:build', 'sass:watch', 'copy'], function() {
    bundle(true);

    // opens the browser window with the correct url, which is localhost.com
    opn('http://www.localhost.com:3000');
});

gulp.task('styleguide', ['browser-sync', 'run-server', 'sass:build', 'sass:watch', 'copy'], function() {
    bundle(true, './styleguide/app.js');
});

gulp.task('jest', function(done) {
    jest.runCLI({ config : config.jestOptions }, ".", function() {
        done();
    });
});

gulp.task('jest:watch', function(done) {
    gulp.watch([ config.jestOptions.rootDir + "/**/*.js" ], [ 'jest' ]);
});

gulp.task('run-server', function() {
    server.listen(4000);
});

gulp.task('browser-sync', function() {
    browserSync({
        files: config.filesToWatch,
        proxy: 'http://localhost:4000',
        port: 3000,
        open: false, // does not open the browser-window anymore (handled manually)
        ghostMode: false
    });
});

gulp.task('sass:build', function () {
    gulp.src('./sass/**/main.scss')
        .pipe(template(constants))
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass({
            includePaths: [
                config.bootstrapDir + '/assets/stylesheets'
            ]
        }).on('error', sass.logError))
        .pipe(gulpif(!argv.production, sourcemaps.write('./maps')))
        .pipe(gulpif(argv.production, minifyCss()))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass:build']);
});

gulp.task('copy', function () {
    var staticAssets = [
        './fonts/**/*',
        './img/**/*'
    ];

    gulp.src(staticAssets, {base: './'})
        .pipe(gulp.dest('./build'));

    gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'));

    gulp.src('./index.html')
        .pipe(template(constants))
        .pipe(gulp.dest('./build'));
});

gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format());
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
});

gulp.task('lint:watch', function () {
    gulp.watch('js/**/*.js', ['lint']);
});

function bundle(watch, sourceFile, destDir) {
    var bro,
        sourceFile = sourceFile || './js/app.js',
        destDir = destDir || './build/js';

    if (watch) {
        bro = watchify(browserify(sourceFile,
            // Assigning debug to have sourcemaps
            _.assign(watchify.args, {
                debug: true
            })));
        bro.on('update', function() {
            rebundle(bro, true);
        });
    } else {
        bro = browserify(sourceFile, {
            debug: true
        });
    }

    bro.transform(babelify.configure({
        compact: false
    }));

    function rebundle(bundler, watch) {
        return bundler.bundle()
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(source('app.js'))
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(buffer())
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(gulpif(!argv.production, sourcemaps.init({
                loadMaps: true
            }))) // loads map from browserify file
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(gulpif(!argv.production, sourcemaps.write())) // writes .map file
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(gulpif(argv.production, uglify({
                mangle: true
            })))
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(gulp.dest(destDir))
            .on('error', notify.onError('Error: <%= error.message %>'))
            .pipe(browserSync.stream())
            .on('error', notify.onError('Error: <%= error.message %>'));
    }

    return rebundle(bro);
}
