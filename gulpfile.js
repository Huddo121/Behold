var gulp = require('gulp');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var changed = require('gulp-changed');

var config = {
    src: './src',
    target: './target',
    bowerRoot: './bower_components',
    paths: {
        picnic: './bower_components/picnic/releases/picnic.min.css',
    }
};

gulp.task('default', () => {
    return gutil.log('No task specified, performing no action');
});

gulp.task('public', () => {
    return gulp.src([
            config.src + '/public/images/**',
            config.src + '/public/javascripts/**/*.*',
            config.src + '/public/stylesheets/**/*.less'
        ], {base: config.src})
        .pipe(gulp.dest(config.target))
});

gulp.task('build', ['public', 'third-party-files'], () => {
    return gulp.src([
            config.src + '/bin/**/*',
            config.src + '/routes/**/*',
            config.src + '/views/**/*',
            config.src + '/*.js'
        ], {base: config.src})
        .pipe(gulp.dest(config.target))
});

gulp.task('third-party-files', () => {
    return gulp.src([
            config.paths.picnic
        ])
        .pipe(gulp.dest(config.target + '/public/stylesheets/'));
});

gulp.task('docker', ['build'], shell.task([
    'docker build -t huddo121/behold .'
]));
