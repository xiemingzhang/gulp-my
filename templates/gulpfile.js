const gulp = require('gulp');
const fs = require('fs')
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

gulp.task('default', ['clean', 'copy', 'bable2es5', 'jscompress'], () => {
    console.log("完成")
});

gulp.task('clean', function() {
    return gulp.src(['build', 'publish'])
        .pipe(clean());
})

gulp.task('copy', ['clean'], () => {
    return gulp.src('proj/**/*')
        .pipe(gulp.dest('build'))
});

gulp.task('bable2es5', ['copy'], () => {
    return gulp.src(['build/**/src/*.js', 'build/**/src/common/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["babel-plugin-transform-remove-strict-mode"]
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
});

gulp.task('jscompress', ['bable2es5'], () => {
    return gulp.src(['build/**/src/*.js', 'build/**/src/common/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(function(file) { return file.base; }));
})

gulp.task('copy2', ['jscompress'], () => {
    var dir = fs.readdirSync('build/')
    dir.map(function(dir) {
        gulp.src('build/' + dir + '/**')
            .pipe(gulp.dest('publish'))
    })
});

gulp.task('publish', ['copy2'], () => {
    return gulp.src(['build/**/src/*.js', 'build/**/src/common/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(function(file) { return file.base; }));
})

gulp.task('clean3', () => {
    return gulp.src(['myRelease'])
        .pipe(clean());
});

// gulp.task('copy3', ['clean3'], () => {
//     var dir = fs.readdirSync('proj/')
//     dir.map(function(dir) {
//         if(dir !== '.git'){
//            gulp.src('proj/' + dir + '/**')
//             .pipe(gulp.dest('my')) 
//         }  
//     })
// });
gulp.task('copy3', ['clean3'], () => {
    var dir = fs.readdirSync('games/')
    dir.map(function(dir) {
        if(dir !== '.git'){
           gulp.src('games/' + dir + '/**')
            .pipe(gulp.dest('myRelease')) 
        }  
    })
});

// gulp.task('getMy', ['copy3'], () => {//bable2es5
//     return gulp.src(['my/**/src/*.js', 'my/**/src/common/*.js'])
//         .pipe(babel({
//             presets: ['es2015'],
//             plugins: ["babel-plugin-transform-remove-strict-mode"]
//         }))
//         .pipe(gulp.dest(function(file) { return file.base; }));
// });
// 
gulp.task('getMy', ['copy3'], () => {//bable2es5
    return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["babel-plugin-transform-remove-strict-mode"]
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
});

// gulp.task('bable2es55', () => {
//     return gulp.src(['proj/index.js'])
//         .pipe(babel({
//             presets: ['es2015'],
//             plugins: ["babel-plugin-transform-remove-strict-mode"]
//         }))
//         .pipe(gulp.dest(function(file) { return file.base; }));
// });