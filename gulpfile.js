var gulp = require('gulp');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var changed = require('gulp-changed');
var gls = require('gulp-live-server');
var babel = require('gulp-babel');

var config = {
    src: './src',
    target: './target',
    bowerRoot: './bower_components',
    paths: {
        picnic: './bower_components/picnic/releases/picnic.min.css',
        mdbootstrap: {
            css: './node_modules/mdbootstrap/css/*.min.css',
            js: './node_modules/mdbootstrap/js/*.min.js',
            fonts: './node_modules/mdbootstrap/font/**/*'
        },
        highlightjs: './node_modules/highlightjs/styles/monokai_sublime.css'
    }
};

gulp.task('default', () => {
    return gutil.log('No task specified, performing no action');
});


//Spin up the development server
gulp.task('serve', ['watch'], function() {
    //1. run your script as a server
    var server = gls.new(config.target + '/bin/www');
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch([config.target + '/**/*'], function (file) {
        server.notify.apply(server, [file]);
    });

});

gulp.task('watch', ['build'], () => {
    gulp.watch(config.src + '/views/**/*.jsx', ['build']);
    gulp.watch(config.src + '/bin/**/*', ['build']);
    gulp.watch(config.src + '/routes/**/*', ['build']);
});

gulp.task('public', () => {
    return gulp.src([
            config.src + '/public/images/**',
            config.src + '/public/javascripts/**/*.*',
            config.src + '/public/stylesheets/**/*.less'
        ], {base: config.src})
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target))
});

gulp.task('build', ['public', 'third-party-files'], () => {
    gulp.src([
            config.src + '/views/**/*',
            config.src + '/public/**/*'
        ], {base: config.src})
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target));

    return gulp.src([
        config.src + '/bin/**',
        config.src + '/**/*.js',
        '!' + config.src + '/src/views/**/*'
    ], {base: config.src})
        .pipe(babel())
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target));
});

gulp.task('third-party-files', ['third-party-styles', 'third-party-js', 'third-party-fonts']);

gulp.task('third-party-styles', () => {
    return gulp.src([
        config.paths.mdbootstrap.css,
        config.paths.highlightjs
        ])
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target + '/public/stylesheets/'));
});

gulp.task('third-party-js', () => {
    return gulp.src([
        config.paths.mdbootstrap.js
        ])
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target + '/public/javascripts/'));
});

gulp.task('third-party-fonts', () => {
    return gulp.src([
        config.paths.mdbootstrap.fonts
    ])
        .pipe(changed(config.target))
        .pipe(gulp.dest(config.target + '/public/fonts/'));
});

gulp.task('docker', ['build'], shell.task([
    'docker build -t huddo121/behold .'
]));
