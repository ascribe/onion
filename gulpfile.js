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

var config = {
    bootstrapDir: './node_modules/bootstrap-sass',
    buildDir: './build'
};

gulp.task('build', function() {
    bundle(false);
});
 
gulp.task('serve', ['browser-sync', 'sass:watch', 'copy'], function() {
    bundle(true);
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "."
        },
        port: process.env.PORT || 3000
    });
});

// Transforming .scss to .css
gulp.task('sass', function () {
    gulp.src('./sass/**/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.bootstrapDir + '/assets/stylesheets'
            ]
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.buildDir + '/css'))
        .pipe(browserSync.stream());;
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('copy', function () {
    var filesToCopy = [
        './fonts/**/*',
        './img/**/*'
    ];

    // Copy other vendor fonts and images
    gulp.src(filesToCopy, {base: './'})
        .pipe(gulp.dest(config.buildDir));

    // Copy bootstrap fonts
    gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
        .pipe(gulp.dest(config.buildDir + '/fonts'));
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
            .pipe(gulp.dest(config.buildDir))
            .pipe(browserSync.stream());
    }
 
    return rebundle(bro);
}