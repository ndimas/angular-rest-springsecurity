'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglifyjs = require('gulp-uglifyjs');
var zip = require('gulp-zip');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var util = require('gulp-util');

var dateFormat = require('date-format');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var httpProxy = require('http-proxy');
var tinyLiveReload = require('tiny-lr');
var connectLiveReload = require('connect-livereload');
var eventStream = require('event-stream');

var argv = require('yargs').argv;

var project = require('./package.json');

var timestamp = dateFormat(argv['timestamp-format'] || process.env['GULP_TIMESTAMP_FORMAT'] || 'yyyyMMddhhmmss');

function proxy(target) {
    var proxyServer = httpProxy.createProxyServer({
        target: target
    });

    proxyServer.on('error', function (err, req, res) {
        res.status(503).end();
    });

    return function (req, res) {
        proxyServer.web(req, res);
    }
}

function sendStream(res, stream) {
    return stream.pipe(eventStream.map(function(file, callback) {
            var contentType = express.static.mime.lookup(file.path);
            var charset = express.static.mime.charsets.lookup(contentType);

            res.set('Content-Type', contentType + (charset ? '; charset=' + charset : ''));

            callback(null, file.contents);
        }))
        .pipe(res);
}

function expressIndex() {
    return function (req, res) {
        sendStream(res, gulp.src('src/main/webapp/index.html')
            .pipe(inject(appJs(), { ignorePath: 'src/main/webapp', addRootSlash: false })));
    }
}

function expressJasmine() {
    return function (req, res, next) {
        var staticServer = express.static('src/test/webapp');

        if (req.path == '/') {
            sendStream(res, gulp.src('src/test/webapp/html/jasmine-index.html')
                .pipe(inject(testJs(), { ignorePath: ['src/main/webapp', 'src/test/webapp'], addRootSlash: false })));
        }
        else {
            staticServer(req, res, next);
        }
    };
}

function expressStatic(path) {
    return function (req, res, next) {
        var staticServer = express.static(path);

        return staticServer(req, res, function () {
            res.status(404).send('Not Found');
        });
    };
}

function compileJs() {
    return appJs()
        .pipe(uglifyjs('app.v' + timestamp + '.js', {
            basePath: 'js',
            mangle: false,
            outSourceMap: argv['uglifyjs-out-source-maps'] || process.env['GULP_UGLIFYJS_OUT_SOURCE_MAPS'] !== undefined
        }))
        .pipe(gulp.dest('target/gulp/js'));
}

function compileScss(errLogToConsole) {
    var enableSassSourceMaps = argv['enable-sass-source-maps'] || process.env['GULP_ENABLE_SASS_SOURCE_MAPS'] !== undefined;

    return gulp.src('src/main/webapp/scss/main.scss')
        .pipe(gulpIf(enableSassSourceMaps, sourcemaps.init()))
        .pipe(sass({
            errLogToConsole: errLogToConsole,
            outputStyle: argv['sass-output-style'] || process.env['GULP_SASS_OUTPUT_STYLE'] || 'compressed',
            sourceMap: '' // Required to prevent gulp-sass from crashing.
        }))
        .pipe(rename('style.css'))
        .pipe(gulpIf(enableSassSourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('src/main/webapp/css'));
}

function appJs() {
    return gulp.src([
        'src/main/webapp/js/jquery/jquery.js',
        'src/main/webapp/js/angular/angular.js',
        'src/main/webapp/js/angular/angular-route.js',
        'src/main/webapp/js/angular/angular-messages.js',
        'src/main/webapp/js/angular/angular-aria.js',
        'src/main/webapp/js/bootstrap/bootstrap.js',
        'src/main/webapp/js/angular-xeditable/xeditable.js',
        'src/main/webapp/js/custom/app.js',
        'src/main/webapp/js/custom/config.js',
        'src/main/webapp/js/custom/listener.js',
        'src/main/webapp/js/custom/constants.js',
        'src/main/webapp/js/custom/constants/**/*.js',
        'src/main/webapp/js/custom/directive.js',
        'src/main/webapp/js/custom/directives/**/*.js',
        'src/main/webapp/js/custom/controller.js',
        'src/main/webapp/js/custom/controllers/**/*.js',
        'src/main/webapp/js/custom/service.js',
        'src/main/webapp/js/custom/services/**/*.js'
    ]);
}

function testJs() {
    return gulp.src([
        'src/main/webapp/js/jquery/jquery.js',
        'src/main/webapp/js/angular/angular.js',
        'src/main/webapp/js/angular/angular-route.js',
        'src/main/webapp/js/angular/angular-messages.js',
        'src/main/webapp/js/angular/angular-aria.js',
        'src/main/webapp/js/bootstrap/bootstrap.js',
        'src/main/webapp/js/angular-xeditable/xeditable.js',
        'src/test/webapp/specs/angular/angular-mocks.js',
        'src/test/webapp/specs/angular/angular-jasmine.js',
        'src/main/webapp/js/custom/app.js',
        'src/main/webapp/js/custom/config.js',
        'src/main/webapp/js/custom/listener.js',
        'src/main/webapp/js/custom/constants.js',
        'src/main/webapp/js/custom/constants/**/*.js',
        'src/main/webapp/js/custom/directive.js',
        'src/main/webapp/js/custom/directives/**/*.js',
        'src/main/webapp/js/custom/controller.js',
        'src/main/webapp/js/custom/controllers/**/*.js',
        'src/main/webapp/js/custom/service.js',
        'src/main/webapp/js/custom/services/**/*.js',
        'src/test/webapp/specs/custom/**/*.spec.js'
    ]);
}

gulp.task('compile-js', function () {
    return compileJs();
});

gulp.task('compile-scss', function () {
    return compileScss(false);
});

gulp.task('watch-scss', ['compile-scss'], function () {
    var logPrefix = '[' + util.colors.blue('watch-scss') + ']';

    gulp.watch('src/main/webapp/scss/**/*.scss', function () {
        util.log(logPrefix, 'Recompiling SCSS');

        compileScss(true);
    });
});

gulp.task('zip', ['compile-js', 'compile-scss'], function () {
    var buildNumber = argv['build-number'] || process.env['GULP_BUILD_NUMBER'];
    var filename = argv['zip-filename'] || process.env['GULP_ZIP_FILENAME'] || project.name + '-' + project.version + (buildNumber !== undefined ? '+build.' + buildNumber : '') + '.zip';

    util.log('Creating', util.colors.magenta(filename));

    return eventStream.merge(
            gulp.src([
                argv['uglifyjs-out-source-maps'] || process.env['GULP_UGLIFYJS_OUT_SOURCE_MAPS'] ? 'src/main/webapp/js/**' : '',
                'src/main/webapp/css/**',
                'src/main/webapp/fonts/**',
                'src/main/webapp/html/**',
                'src/main/webapp/img/**'
            ], { base: 'src/main/webapp' }),

            gulp.src('target/gulp/**'),

            gulp.src('src/main/webapp/index.html')
                .pipe(inject(gulp.src('target/gulp/js/app.v' + timestamp + '.js'),
                    { ignorePath: 'target/gulp', addRootSlash: false }))
        )
        .pipe(zip(filename))
        .pipe(gulp.dest('target'));
});

gulp.task('run', ['watch-scss'], function () {
    var logPrefix = '[' + util.colors.blue('run') + ']';

    var apiUrl = argv['api-url'] || process.env['GULP_API_URL'] || 'http://localhost:8080/';
    var expressPort = argv['express-port'] || process.env['GULP_EXPRESS_PORT'] || 7777;
    var liveReloadPort = argv['live-reload-port'] || process.env['GULP_LIVE_RELOAD_PORT'] || 35729;

    var liveReload = tinyLiveReload();

    liveReload.listen(liveReloadPort);

    gulp.watch(['src/main/webapp/index.html', 'src/main/webapp/html/**', 'src/main/webapp/js/**', 'src/main/webapp/css/**', 'src/main/webapp/fonts/**', 'src/test/webapp/specs/custom/**/*.spec.js'], function (event) {
        util.log(logPrefix, 'Reloading', path.relative('src/main/webapp', event.path));

        liveReload.changed({
            body: {
                files: [
                    path.relative('src/main/webapp', event.path)
                ]
            }
        });
    });

    return express()
        .use(morgan('combined'))
        .all('/api/*', proxy(apiUrl))
        .use('/css', expressStatic('src/main/webapp/css'))
        .use('/fonts', expressStatic('src/main/webapp/fonts'))
        .use('/html', expressStatic('src/main/webapp/html'))
        .use('/img', expressStatic('src/main/webapp/img'))
        .use('/js', expressStatic('src/main/webapp/js'))
        .use(connectLiveReload({
            port: liveReloadPort
        }))
        .use('/test', expressJasmine())
        .use('/specs', expressStatic('src/test/webapp/specs'))
        .use(expressIndex())
        .listen(expressPort, function () {
            util.log(logPrefix, 'Listening on port', util.colors.green(expressPort));
        });
});

gulp.task('clean', function () {
    return gulp.src('target/gulp', { read: false })
        .pipe(clean());
});

gulp.task('default', ['zip']);