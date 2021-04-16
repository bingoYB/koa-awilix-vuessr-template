const gulp = require('gulp');
const watch = require('gulp-watch');
const entry = './src/server/**/*.js';
// 防止因gulp插件的错误而导致管道中断，plumber可以阻止 gulp 插件发生错误导致进程退出并输出错误日志
const plumber = require('gulp-plumber');
const cleanEntry = './src/server/config/index.js';
const rollup = require('gulp-rollup');
const babel = require('gulp-babel');
const replace = require('@rollup/plugin-replace');
const prepack = require('gulp-prepack');
const sourceMaps = require('gulp-sourcemaps');
const { spawn } = require('child_process');


function builddev() {
  return watch(entry, { ignoreInitial: false }, () => {
    gulp
      .src(entry)
      .pipe(sourceMaps.init())
      .pipe(plumber())
      .pipe(
        babel({
          babelrc: false,
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-transform-modules-commonjs',
          ],
        })
      )
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('dist'));
  });
}

function buildprod() {
  return gulp
    .src(entry)
    .pipe(
      babel({
        babelrc: false,
        // ignore: [cleanEntry],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-transform-modules-commonjs',
        ],
      })
    )
    .pipe(gulp.dest('dist'));
}

//清理环境变量
function buildconfig() {
  return (
    gulp
      .src(entry)
      .pipe(
        rollup({
          input: cleanEntry,
          output: {
            format: 'cjs',
          },
          plugins: [
            replace({
              'process.env.NODE_ENV': JSON.stringify('production'),
            }),
          ],
        })
      )
      .pipe(prepack({}))
      .pipe(gulp.dest('./dist'))
  );
}

var serverNode = undefined
gulp.task('serve-dev', (done) => {
  if (serverNode) serverNode.kill(); // Kill existing server
  serverNode = spawn('node', ['--inspect-brk=0.0.0.0:9229', './dist/app.js']); // Run server instance
})


let build = gulp.series(builddev);
if (process.env.NODE_ENV == 'production') {
  build = gulp.series(buildprod);
}

gulp.task('default', build);
