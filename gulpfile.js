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
    bootstrapDir: './node_modules/bootstrap-sass'
};

gulp.task('build', function() {
    bundle(false);
});
 
gulp.task('serve', ['browser-sync', 'sass', 'sass:watch', 'copy'], function() {
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

gulp.task('sass', function () {
    gulp.src('./sass/**/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.bootstrapDir + '/assets/stylesheets'
            ]
        }).on('error', sass.logError))
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