const gulp = require('gulp');
const fs = require('fs');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourceMap = require('gulp-sourcemaps');

gulp.task('default', ['jscompress'], () => {
    console.log("完成")
});

gulp.task('bable2es5', () => {
    return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["babel-plugin-transform-remove-strict-mode"]
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
});

gulp.task('jscompress', ['bable2es5'], () => {
    return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: "license" //保留所有注释
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
})

// ///////////////////////

gulp.task('clean3', () => {
    return gulp.src(['myRelease'])
        .pipe(clean());
});

gulp.task('copy3', ['clean3'], () => {
    var dir = fs.readdirSync('games/')
    dir.map(function(dir) {
        if(dir !== '.git'){
           gulp.src('games/' + dir + '/**')
            .pipe(gulp.dest('myRelease')) 
        }  
    })
});

gulp.task('getMy', ['copy3'], () => {//bable2es5
    return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["babel-plugin-transform-remove-strict-mode"]
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
});

////////////////////////////

gulp.task('cocosclean', () => {
    return gulp.src(['cocos', 'maps'])
        .pipe(clean());
});

gulp.task('cocosminjs', ['cocosclean'], () => {
    var pathArr = JSON.parse(fs.readFileSync("./path.json")).pathArr;
    pathArr = pathArr.map(function(item){
        return 'myRelease/' + item
    })
    return gulp.src(pathArr)
        .pipe(sourceMap.init())
        .pipe(concat('mycocos.min.js')) 
        .pipe(uglify({output:{ 
            // comments:/.license./ 
        }}))
        .pipe( sourceMap.write('maps/',{addComment: false}) )
        .pipe(gulp.dest('cocos/'));
})

gulp.task('cocosjs', ['cocosclean'], () => {
    var pathArr = JSON.parse(fs.readFileSync("./path.json")).pathArr;
    pathArr = pathArr.map(function(item){
        return 'myRelease/' + item
    })
    return gulp.src(pathArr)
        .pipe(concat('mycocos.js')) 
        .pipe(gulp.dest('cocos/'));
})