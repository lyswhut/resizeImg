const gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),//html压缩组件
    gulpRemoveHtml = require('gulp-remove-html'),//标签清除，参考
    removeEmptyLines = require('gulp-remove-empty-lines'),//清除空白行，参考
    babel = require('gulp-babel'),//编译se6
    concat = require('gulp-concat'),//文件合并
    uglify = require('gulp-uglify'),//js文件压缩
    rename = require('gulp-rename'),//文件重命名
    del = require('del');//删除文件


gulp.task('clean:html', function(cb) {
  del(['dist/**/*.html'], cb);
});
gulp.task('clean:js', function(cb) {
  del(['dist/**/*.js'], cb);
});

//压缩js
gulp.task('minifyjs', function(){
  return gulp.src(['./src/js/resizeImg.js', './src/js/jpeg_encoder_basic.js', './src/js/megapix-image.js'])
    .pipe(babel({presets:['es2015']}))//编译se6
    .pipe(concat('resizeImg.js'))//合并所有js到resizeImg.js
    .pipe(gulp.dest('dist/js'))//输出resize.js到文件夹
    .pipe(rename({suffix: '.min'}))//rename压缩后的文件名
    .pipe(uglify({
      output: {
        comments: 'some'
      }
    }))//压缩
    .pipe(gulp.dest('dist/js'));//输出
});

//压缩html
gulp.task('html',function(){
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: false,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    // minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  return gulp.src('src/*.html')
    // .pipe(gulpRemoveHtml())//清除特定标签
    // .pipe(removeEmptyLines({removeComments: true}))//清除空白行
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function(){
  gulp.watch('src/js/resizeImg.js', ['clean:js', 'minifyjs']);
  gulp.watch('src/**/*.html', ['clean:html','html']);
});

