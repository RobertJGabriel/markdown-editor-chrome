
const { series, src, dest } = require("gulp");
import gulpLoadPlugins from "gulp-load-plugins";
import sass from "gulp-sass";
import webpackStream from "webpack-stream";
import webpack from "webpack";

const $ = gulpLoadPlugins();

function extras() {
  return src(
    [
      "app/*.*",
      "app/fonts/**/*.*",
      "app/scripts/**/*.js",
      "app/scripts/**/*.min.css",
      "app/_locales/**",
      "!app/scripts.babel",
      "!app/manifest.json",
      "!app/*.html"
    ],
    {
      base: "app",
      dot: true
    }
  ).pipe(dest("dist"));
}

exports.extras = extras;

function lint(files, options) {
  return () => {
    return src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

exports.lint = lint;

function css() {
  return src(["app/styles/sass/fonts/*.sass"])
    .pipe($.sass().on("error", sass.logError))
    .pipe(dest("dist/styles/"));
}

exports.css = css;

function images() {
  return src("app/images/**/*")
    .pipe(
      $.if(
        $.if.isFile,
        $.cache(
          $.imagemin({
            progressive: true,
            interlaced: true,
            // Don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [
              {
                cleanupIDs: false
              }
            ]
          })
        ).on("error", function(err) {
          console.log(err);
          this.end();
        })
      )
    )
    .pipe(dest("dist/images"));
}

exports.images = images;

function html() {
  return src("app/*.html")
    .pipe(
      $.useref({
        searchPath: [".tmp", "app", "."]
      })
    )
    .pipe($.sourcemaps.init())
    .pipe($.if("*.js", $.uglify()))
    .pipe($.sourcemaps.write())
    .pipe(
      $.if(
        "*.html",
        $.htmlmin({
          removeComments: true,
          collapseWhitespace: true
        })
      )
    )
    .pipe(dest("dist"));
}

exports.html = html;

function chromeManifest() {
  return src("app/manifest.json").pipe(dest("dist"));
}

exports.chromeManifest = chromeManifest;

function babel() {
  return src("app/scripts.babel")
    .pipe(
      webpackStream(require("./webpack.config.js"), webpack).on(
        "error",
        function(err) {
          console.log(err);
          this.emit("end");
        }
      )
    )
    .pipe(dest("app/scripts/"));
}

exports.babel = babel;

function babelRead() {
  return src("app/scripts.babel/3rd/**/*.js").pipe(dest("app/scripts/"));
}

exports.babelRead = babelRead;

function size() {
  return src("dist/**/*").pipe(
    $.size({
      title: "build",
      gzip: true
    })
  );
}

exports.size = size;

function package_edge() {
  const manifest = require("./dist/manifest.json");
  return src("dist/**")
    .pipe($.zip(manifest.version + ".zip"))
    .pipe(dest("package/edge"));
}

exports.package_edge = package_edge;

function package_firefox() {
  const manifest = require("./dist/manifest.json");
  return src("dist/**")
    .pipe($.zip(manifest.version + ".zip"))
    .pipe(dest("package/firefox"));
}

exports.package_firefox = package_firefox;

function package_chrome() {
  const manifest = require("./dist/manifest.json");
  return src("dist/**")
    .pipe($.zip(manifest.version + ".zip"))
    .pipe(dest("package/chrome"));
}

exports.package_chrome = package_chrome;

exports.build = series(
  css,
  babel,
  babelRead,
  html,
  images,
  extras,
  chromeManifest,
  size
);
exports.default = exports.build;
