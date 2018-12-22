// 在gulpfile中先载入gulp包
var gulp = require('gulp');
// 使用$引用以gulp开头的模块
var $ = require('gulp-load-plugins')();

var open = require('open');

// 定义一个对象保存路径
var path = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

// 拷贝静态资源
gulp.task('static-js', function () {
    gulp.src(path.srcPath +'static/js/*.js')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'static/js'))
        .pipe(gulp.dest(path.prdPath + 'static/js'))
        .pipe($.connect.reload());
});
// gulp.task('static-css', function () {
//     gulp.src(path.srcPath + 'static/css/*.css')
//         .pipe($.plumber())
//         .pipe(gulp.dest(path.devPath + 'static/css'))
//         .pipe($.cssmin())
//         .pipe(gulp.dest(path.prdPath + 'static/css'))
//         .pipe($.connect.reload());
// });
gulp.task('static-image', function () {
    gulp.src(path.srcPath + 'static/images/*')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'static/images'))
        .pipe($.imagemin())
        .pipe(gulp.dest(path.prdPath + 'static/images'))
        .pipe($.connect.reload());
});

// 拷贝 压缩html文件
gulp.task('html', function () {
    gulp.src(path.srcPath + 'page/*.html')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'page'))
        .pipe($.htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(path.prdPath + 'page'))
        .pipe($.connect.reload());
});


// 编译 压缩less文件
gulp.task('less', function () {
    gulp.src(path.srcPath + 'static/css/*.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(path.devPath + 'static/css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(path.prdPath + 'static/css'))
        .pipe($.connect.reload());
})

// 合并 压缩混淆js文件
gulp.task('js', function () {
    gulp.src(path.srcPath + 'pages/**/*.js')
        .pipe($.plumber())
        // .pipe($.concat('index.js'))
        .pipe(gulp.dest(path.devPath))
        .pipe($.uglify())
        .pipe(gulp.dest(path.prdPath))
        .pipe($.connect.reload());
});

// 压缩image文件
gulp.task('image', function () {
    gulp.src(path.srcPath + 'static/images/*')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'static/images'))
        .pipe($.imagemin())
        .pipe(gulp.dest(path.prdPath + 'static/images'))
        .pipe($.connect.reload());
})

gulp.task('build', [
    'static-js',
    // 'static-css',
    'static-image',
    'html',
    'less',
    'js',
    'image'
]);

gulp.task('clean', function () {
    gulp.src([path.devPath, path.prdPath])
        .pipe($.clean());
});

gulp.task('clean-css', function () {
    gulp.src('*.css')
        .pipe($.clean());
});

gulp.task('serve', ['build'], function () {
    // $.connect.server({
    //     root: [path.devPath],
    //     livereload: true,
    //     port: 1235
    // });
    // open('http://localhost:1235/home');
    gulp.watch(path.srcPath + 'static/js/*', ['static-js']);
    // gulp.watch(path.srcPath + 'static/css/*', ['static-css']);
    gulp.watch(path.srcPath + 'static/images/*', ['static-image']);
    gulp.watch(path.srcPath + 'pages/**/*.html', ['html']);
    gulp.watch(path.srcPath + 'pages/**/*.less', ['less']);
    gulp.watch(path.srcPath + 'pages/**/*.js', ['js']);
});