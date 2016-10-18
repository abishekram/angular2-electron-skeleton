
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    traceur = require('gulp-traceur'),
    del = require('del'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    electron = require('gulp-atom-electron'),
    symdest = require('gulp-symdest');

    var config = {
      sourceDir: 'src',
      buildDir: 'build',
      packagesDir: 'packages',
      bowerDir:    'bower_components',
      npmDir: 'node_modules'
    };
    gulp.task('clean', [
      'clean:build',
      'clean:package'
    ]);
    gulp.task('frontend:sass', function () {
      return gulp.src(config.sourceDir + '/**/*.scss')
        .pipe(sass({
          style: 'compressed',
          includePaths: [
            config.sourceDir + '/styles',
            config.bowerDir + '/bootstrap-sass/assets/stylesheets'
          ]
        }))
        .pipe(gulp.dest(config.buildDir));
    });
    gulp.task('clean:build', function() {
      return del(config.buildDir + '/**/*', { force: true });
    });

    gulp.task('clean:package', function() {
      return del(config.packagesDir + '/**/*', { force: true });
    });
    gulp.task('package', [
      // 'package:osx',
      'package:linux'
      // 'package:windows'
    ]);

    // gulp.task('package:osx', function() {
    //   return gulp.src(config.buildDir + '/**/*')
    //     .pipe(electron({
    //       version: '0.36.7',
    //       platform: 'darwin'
    //     }))
    //     .pipe(symdest(config.packagesDir + '/osx'));
    // });

    gulp.task('package:linux', function() {
      return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
          version: '0.36.7',
          platform: 'linux'
        }))
        .pipe(symdest(config.packagesDir + '/linux'));
    });

    // gulp.task('package:windows', function() {
    //   return gulp.src(config.buildDir + '/**/*')
    //     .pipe(electron({
    //       version: '0.36.7',
    //       platform: 'win32'
    //     }))
    //     .pipe(symdest(config.packagesDir + '/windows'));
    // });

//Deletes Build Dir
gulp.task('clean', function() {
  return del(config.buildDir + '/**/*', { force: true });
});

// run init tasks
gulp.task('default', ['dependencies', 'js', 'html', 'css']);

// run development task
gulp.task('dev', ['watch', 'serve']);

// serve the build dir
gulp.task('serve', function () {
  gulp.src('build')
    .pipe(webserver({
      open: true
    }));
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  gulp.watch(config.sourceDir + '/**/*.js', ['frontend:js']);
  gulp.watch(config.sourceDir + '/**/*.html', ['frontend:html']);
  gulp.watch(config.sourceDir + '/**/*.css', ['frontend:css']);
});


gulp.task('frontend', [
  'frontend:dependencies',
  'frontend:js',
  'frontend:map',
  'frontend:html',
  'frontend:css',
  'frontend:sass'
]);

gulp.task('frontend:dependencies', function() {
  return gulp.src([
    config.npmDir + '/traceur/bin/traceur-runtime.js',
    config.npmDir + '/systemjs/dist/system-csp-production.src.js',
    config.npmDir + '/systemjs/dist/system.js',
    config.npmDir + '/reflect-metadata/Reflect.js',
    config.npmDir + '/angular2/bundles/angular2.dev.js',
    config.npmDir + '/angular2/bundles/angular2-polyfills.js',
    config.npmDir + '/rxjs/bundles/Rx.js',
    config.npmDir + '/es6-shim/es6-shim.min.js',
    config.npmDir + '/es6-shim/es6-shim.map',
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  ])
    .pipe(gulp.dest(config.buildDir + '/lib'));
});

// gulp.task('frontend:js', function() {
//   return gulp.src(config.sourceDir + '/**/*.js')
//     .pipe(rename({
//       extname: ''
//     }))
//     .pipe(traceur({
//       modules: 'instantiate',
//       moduleName: true,
//       annotations: true,
//       types: true,
//       memberVariables: true
//     }))
//     .pipe(rename({
//       extname: '.js'
//     }))
//     .pipe(gulp.dest(config.buildDir));
// });
gulp.task('frontend:js', function () {
  return gulp.src(config.sourceDir + '/**/*.js')
    .pipe(gulp.dest(config.buildDir))
});
gulp.task('frontend:html', function () {
  return gulp.src(config.sourceDir + '/**/*.html')
    .pipe(gulp.dest(config.buildDir))
});
gulp.task('frontend:map', function () {
  return gulp.src(config.sourceDir + '/**/*.map')
    .pipe(gulp.dest(config.buildDir))
});
gulp.task('frontend:css', function () {
  return gulp.src(config.sourceDir + '/**/*.css')
    .pipe(gulp.dest(config.buildDir))
});

gulp.task('electron', function() {
  return gulp.src([
    config.sourceDir + '/electron/main.js',
    config.sourceDir + '/electron/package.json'
  ])
    .pipe(gulp.dest(config.buildDir));
});

// // move dependencies into build dir
// gulp.task('dependencies', function () {
//   return gulp.src([
//     'node_modules/traceur/bin/traceur-runtime.js',
//     'node_modules/systemjs/dist/system-csp-production.src.js',
//     'node_modules/systemjs/dist/system.js',
//     'node_modules/reflect-metadata/Reflect.js',
//     'node_modules/angular2/bundles/angular2.js',
//     'node_modules/angular2/bundles/angular2-polyfills.js',
//     'node_modules/rxjs/bundles/Rx.js',
//     'node_modules/es6-shim/es6-shim.min.js',
//     'node_modules/es6-shim/es6-shim.map'
//   ])
//     .pipe(gulp.dest('build/lib'));
// });
//
// // transpile & move js
// gulp.task('js', function () {
//   return gulp.src('src/**/*.js')
//     .pipe(rename({
//       extname: ''
//     }))
//     .pipe(traceur({
//       modules: 'instantiate',
//       moduleName: true,
//       annotations: true,
//       types: true,
//       memberVariables: true
//     }))
//     .pipe(rename({
//       extname: '.js'
//     }))
//     .pipe(gulp.dest('build'));
// });
//
// // move html
// gulp.task('html', function () {
//   return gulp.src('src/**/*.html')
//     .pipe(gulp.dest('build'))
// });
//
// // move css
// gulp.task('css', function () {
//   return gulp.src('src/**/*.css')
//     .pipe(gulp.dest('build'))
// });
