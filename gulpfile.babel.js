import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import gulp from 'gulp';
import notify from 'gulp-notify';
import plugins from 'gulp-load-plugins';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import mode from 'gulp-mode';
import cleanCSS from 'gulp-clean-css';

const sass = gulpSass(dartSass);

const $ = plugins();

// Configure gulp mode. See package.json for flags used to trigger different builds
const gulpMode = mode({
  modes: ['production', 'development'],
  default: 'development',
  verbose: false,
});

// Error handler
var onError = function (error) {
  notify.onError({
    title: 'Gulp Error',
    message: '<%= error %>',
  })(error);

  this.emit('end');
};

// Standalone paths
const assetDirs = {
  src: './src/',
  dest: './assets/',
};

const sassPaths = [
  'node_modules/', // Include specific sass files from folders in this directory
];

////////////////////
// App Processors //
////////////////////

// Compile dem styles
const Styles = (function () {
  const paths = {
    src: `${assetDirs.src}scss/`,
    watch: `${assetDirs.src}scss/**/*.scss`,
    dest: `${assetDirs.dest}styles/`,
  };

  const _compile = (fileIn, fileOut) => {
    return gulp
      .src(paths.src + fileIn)
      .pipe(plumber({ errorHanlder: onError }))
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: sassPaths,
        }).on('error', sass.logError),
      )
      .pipe($.autoprefixer())
      .pipe(cleanCSS())
      .pipe(rename(fileOut))
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest(paths.dest));
  };

  return {
    paths,
    compileFluency: () => _compile('fluency_core.scss', 'fluency_core.min.css'),
    compileStandaloneTranslator: () =>
      _compile('fluency_standalone_translator.scss', 'fluency_standalone_translator.min.css'),
    compileModuleConfig: () =>
      _compile('fluency_module_config.scss', 'fluency_module_config.min.css'),
    compileApiUsage: () => _compile('fluency_api_usage.scss', 'fluency_api_usage.min.css'),
  };
})();

// Build dem scripts
const Scripts = (function () {
  const paths = {
    source: `${assetDirs.src}scripts/`,
    watch: `${assetDirs.src}scripts/**/*.js`,
    dest: `${assetDirs.dest}scripts/`,
  };

  const _compile = (fileIn, fileOut) => {
    return browserify({
      entries: `${paths.source}${fileIn}`,
      extensions: ['.js'],
      debug: false,
    })
      .transform(babelify)
      .bundle()
      .pipe(plumber({ errorHandler: onError }))
      .pipe(source(fileOut))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest(paths.dest));
  };

  return {
    paths,
    compileFluency: () => _compile('fluency.js', 'fluency.bundle.js'),
    compileLanguageTranslator: () =>
      _compile('fluency.language_translator.js', 'fluency_language_translator.bundle.js'),
    compileModuleConfig: () =>
      _compile('fluency.module_config.js', 'fluency_module_config.bundle.js'),
    compileStandaloneTranslator: () =>
      _compile('fluency.standalone_translator.js', 'fluency_standalone_translator.bundle.js'),
    compileApiUsage: () => _compile('fluency.api_usage.js', 'fluency_api_usage.bundle.js'),
  };
})();

// Start watch tasks. Command defined in package.json, called with --development flag
const watch = async function () {
  // Styles
  gulp.watch(
    Styles.paths.watch,
    gulp.series(
      Styles.compileFluency,
      Styles.compileStandaloneTranslator,
      Styles.compileApiUsage,
      Styles.compileModuleConfig,
    ),
  );

  // Scripts
  gulp.watch(
    Scripts.paths.watch,
    gulp.series(
      Scripts.compileFluency,
      Scripts.compileStandaloneTranslator,
      Scripts.compileApiUsage,
      Scripts.compileLanguageTranslator,
      Scripts.compileModuleConfig,
    ),
  );
};

// Compile it all. Command defined in package.json, called with --production flag
const build = async function () {
  gulp.series(
    Scripts.compileFluency,
    Scripts.compileStandaloneTranslator,
    Scripts.compileApiUsage,
    Scripts.compileLanguageTranslator,
    Scripts.compileModuleConfig,
    Styles.compileFluency,
    Styles.compileStandaloneTranslator,
    Styles.compileApiUsage,
    Styles.compileModuleConfig,
  );
};

export { watch, build };
