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
var _ = require('lodash');
 
gulp.task('build', function() {
    bundle(false);
});
 
gulp.task('serve', ['browser-sync'], function() {
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