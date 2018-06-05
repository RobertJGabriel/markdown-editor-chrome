import gulp from 'gulp';
import glob from 'glob';
import hash from 'hash-files';
import jsesc from 'jsesc';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import sass from 'gulp-sass';
import runSequence from 'run-sequence';
import {
  stream as wiredep
} from 'wiredep';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/scripts/**/*.js',
    'app/styles/**/*.min.css',
    'app/_locales/**',
    '!app/scripts.babel',
    '!app/*.json',
    '!app/*.html'
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('docs'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('app/scripts.babel/*.js', {
  env: {
    es6: true
  }
}));

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // Don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{
          cleanupIDs: false
        }]
      }))
      .on('error', function (err) {
        console.log(err);
        this.end();
      })))
    .pipe(gulp.dest('docs/images'));
});

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({
      searchPath: ['.tmp', 'app', '.']
    }))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({
      compatibility: '*'
    })))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    })))
    .pipe(gulp.dest('docs'));
});

gulp.task('sass', () => {
  return gulp.src('app/styles/sass/styles.sass')
    .pipe($.sass().on('error', sass.logError))
    .pipe(gulp.dest('docs/styles/'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
 
    }))
    .pipe($.if('*.css', $.cleanCss({
      compatibility: '*'
    })))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.sourcemaps.write('.')))
    .pipe(gulp.dest('docs'));
});

gulp.task('babel', () => {
  return gulp.src('app/scripts.babel/*.js')
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('app/scripts'));
});


gulp.task('thirdparty', () => {
  return gulp.src('app/scripts.babel/vendor/*.js')
    .pipe(gulp.dest('app/scripts/vendor/'));
});


gulp.task('clean', del.bind(null, ['.tmp', 'docs']));

gulp.task('watch', ['lint', 'babel'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts.babel/*.js', ['lint', 'babel']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
  return gulp.src('docs/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});



gulp.task('clean', function () {
  del.sync(['!./docs/CNAME', './docs/*'], {
    force: true
  })
})

var stringify = value => {
  return jsesc(value, {
    wrap: true,
    compact: false,
    indentLevel: 3
  })
}

var shortHash = files => {
  return hash
    .sync({
      files: files
    })
    .slice(0, 8)
}

var assets = ['docs/**/*.*']

gulp.task('cache', () => {
  var assets = [
    ...glob.sync('docs/assets/css/**/*.*'),
    ...glob.sync('docs/*.html'),
    ...glob.sync('docs/**/*.js'),
    ...glob.sync('docs/assets/img/**/me.png'),
    ...glob.sync('docs/assets/img/**/*.svg'),
    ...glob.sync('docs/assets/js/**/*.*')
  ]
  var assetsHash = shortHash(assets)
  var assetCacheList = [
    '/',
    ...assets
    // Remove all `images/icon-*` files except for the one used in
    // the HTML.
    .filter(
      path =>
      !path.includes('images/icon-') || path.includes('icon-228x228.png')
    )
    .map(path => path.replace(/^docs\//, '/'))
  ]

  gulp
    .src('./core/sw.js')
    .pipe(replace('%HASH%', stringify(assetsHash)))
    .pipe(replace('%CACHE_LIST%', stringify(assetCacheList)))
    .pipe(
      rename(path => {
        path.basename = assetsHash
      })
    )
    .pipe(gulp.dest('docs/'))

  gulp
    .src('docs/**/*.html')
    .pipe(
      replace(
        /(<\/body>)/g,
        `<script>
				  if ('serviceWorker' in navigator) {
					  navigator.serviceWorker.register('/${assetsHash}.js');
				  }
			  </script>$1`
      )
    )
    .pipe(gulp.dest('docs/'))

  return del(['docs/service-worker.js'])
})






gulp.task('package', () => {
  const manifest = require('./docs/manifest.json');
  return gulp.src('docs/**')
    .pipe($.zip('chrome teamwork-' + manifest.version + '.zip'))
    .pipe(gulp.dest('package'));
});

gulp.task('build', cb => {
  runSequence(
    'lint', 'babel', 'chromeManifest', 'thirdparty', ['html', 'images', 'sass', 'extras','cache'],
    'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});