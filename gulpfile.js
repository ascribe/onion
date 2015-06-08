'use strict';

require("harmonize")();

var gulp = require('gulp');
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
    }
};

gulp.task('build', function() {
    bundle(false);
});
 
gulp.task('serve', ['browser-sync', 'lint:watch', 'sass', 'sass:watch', 'copy'], function() {
    bundle(true);
});

gulp.task('jest', function(done) {
    jest.runCLI({ config : config.jestOptions }, ".", function() {
        done();
    });
});

gulp.task('jest:watch', function(done) {
    gulp.watch([ config.jestOptions.rootDir + "/**/*.js" ], [ 'jest' ]);
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: '.'
        },
        port: process.env.PORT || 3000
    });
});

gulp.task('sass', function () {
    gulp.src('./sass/**/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.bootstrapDir + '/assets/stylesheets'
            ]
        })
        .on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());;
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('copy', function () {
    var files = [
        './fonts/**/*',
        './img/**/*'
    ];

    gulp.src(files, {base: './'})
        .pipe(gulp.dest('build'));

    gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'));
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

function bundle(watch) {
    var bro;
    if (watch) {
        bro = watchify(browserify('./js/app.js',
            // Assigning debug to have sourcemaps
            _.assign(watchify.args, {
                debug: true
            })));
        bro.on('update', function() {
            rebundle(bro, true);
        });
    } else {
        bro = browserify('./js/app.js', {
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
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            })) // loads map from browserify file
            .pipe(sourcemaps.write()) // writes .map file
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    }

    return rebundle(bro);
}