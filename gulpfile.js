var gulp         = require('gulp'),
    cleanCSS     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    pug          = require('gulp-pug'),
    stylus       = require('gulp-stylus'),
    connect      = require('gulp-connect'),
    notify       = require('gulp-notify'),
    rupture      = require('rupture'),
    typographic  = require('typographic'),
    nib          = require('nib'),
    postCSS      = require('gulp-postcss'),
    lost         = require('lost'),
    replace      = require('gulp-replace'),
    gzip         = require('gulp-gzip'),
    plumber      = require('gulp-plumber'),
    image        = require('gulp-image'),
    resize       = require('gulp-image-resize')
    reTypography = require('postcss-responsive-type'),
    removeFiles  = require('gulp-remove-files'),
    stylint      = require('gulp-stylint'),
    fs           = require('fs'),
    path         = require('path'),
    spritesmith  = require('gulp.spritesmith');

var options = {
  use: [rupture(), typographic(), nib()],
  'include css': true
};

var processors = [
  lost(),
  reTypography()
];

gulp.task('img', () => {
  gulp.src(['img/**/*.{jpg,png,svg}','!img/sprites'])
    .pipe(image())
    .pipe(gulp.dest('dist/img'))

  fs.readdir('img', (err, data) => {
    if(err) throw err;
    data.forEach((e) => {
      if(e.search(/[0-9]/) !== -1 && fs.statSync(path.join('img', e)).isDirectory()) {
          gulp.src(`img/${e}/*`)
              .pipe(resize({
                width: e
              }))
              .pipe(image())
              .pipe(gulp.dest('dist/img'))
      }
    });
  });
});

gulp.task('css', () => {
  gulp.src('stylus/style.styl')
      .pipe(plumber({errorHandler: notify.onError()}))
      .pipe(stylint({config: '.stylintrc'}))
      .pipe(stylint.reporter())
      .pipe(stylus(options))
      .pipe(postCSS(processors))
      // .pipe(autoprefixer({
      //   browsers: ['last 2 versions']
      // }))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({ suffix: '.min'}))
      .pipe(gulp.dest('dist/css'))
      .pipe(connect.reload());
});

gulp.task('html', () => {
  gulp.src(['pug/*.pug', '!pug/layout.pug'])
      .pipe(plumber({errorHandler: notify.onError()}))
      .pipe(pug())
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
});

gulp.task('server', () => {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 3000
  });
});

gulp.task('js', () => {
  gulp.src('js/*.js')
      .pipe(plumber({errorHandler: notify.onError()}))
      .pipe(uglify())
      .pipe(rename({ suffix: '.min'}))
      .pipe(gulp.dest('dist/js'))
      .pipe(connect.reload());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('dist/img/sprites/*')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl'
  }));

  imgStream = spriteData.img
    .pipe(gulp.dest('dist/img/sprites'));

  spriteData.css
    .pipe(gulp.dest('stylus'));
});

gulp.task('watch', () => {
  gulp.watch('pug/*.pug', ['html']);
  gulp.watch('stylus/*.styl', ['css']);
  gulp.watch('js/*.js', ['js']);
});

gulp.task('default', ['css', 'js', 'html', 'server', 'watch']);