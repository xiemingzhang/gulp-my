const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourceMap = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');           //压缩图片1
const tinypng = require('gulp-tinypng-compress');     //压缩图片2 需要有KEY,获取KEY值https://tinypng.com/dashboard/api
const tinypng_nokey = require('gulp-tinypng-nokey');    //压缩图片3 免费

const runSequence = require('run-sequence'); 

const browserify = require('browserify');
const standalonify = require('standalonify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
// const buffer = require('vinyl-buffer');

// gulp.task('default', ['jscompress'], () => {
//     console.log("完成")
// });

// gulp.task('bable2es5', () => {
//     return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
//         .pipe(babel({
//             presets: ['es2015'],
//             plugins: ["babel-plugin-transform-remove-strict-mode"]
//         }))
//         .pipe(gulp.dest(function(file) { return file.base; }));
// });

// gulp.task('jscompress', ['bable2es5'], () => {
//     return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
//         .pipe(uglify({
//             mangle: true,//类型：Boolean 默认：true 是否修改变量名
//             compress: true,//类型：Boolean 默认：true 是否完全压缩
//             preserveComments: "license" //保留所有注释
//         }))
//         .pipe(gulp.dest(function(file) { return file.base; }));
// })

// ///////////////////////

gulp.task('clean3', () => {
    return gulp.src(['myRelease'])
        .pipe(clean());
});

gulp.task('copy3', ['clean3'], () => {
    // var pathArr = fs.readdirSync('games/')
    // pathArr.map(function(dir) {
    //     if(dir !== '.git'){
    //        gulp.src('games/' + dir + '/**')
    //         .pipe(gulp.dest('myRelease')) 
    //     }  
    // })
    // pathArr = pathArr.filter(function(item){
    //     if(item !== '.git' && item !== '.DS_Store'){
    //         return true
    //     } 
    // })
    // pathArr = pathArr.map(function(item){
    //     return 'games/' + item + '/**'
    // })
    return gulp.src('games/**')
            .pipe(gulp.dest('myRelease/')) 
});

gulp.task('bable2es5', ['copy3'], () => {
    return gulp.src(['myRelease/**/app.js', 'myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["babel-plugin-transform-remove-strict-mode"]
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
});

// gulp.task('jscompress', ['bable2es5'], () => {
//     return gulp.src(['myRelease/**/src/*.js', 'myRelease/**/src/common/*.js'])
//         .pipe(uglify({
//             mangle: true,//类型：Boolean 默认：true 是否修改变量名
//             compress: true//类型：Boolean 默认：true 是否完全压缩
//             // preserveComments: "license" //保留版权注释
//         }))
//         .pipe(gulp.dest(function(file) { return file.base; }));
// })

gulp.task('jscompress', ['bable2es5'], () => {
    var pathArr = fs.readdirSync('myRelease/')
    pathArr = pathArr.filter(function(item){
        if(item !== '.git' && item !== '.DS_Store'){
            return true
        } 
    })
    pathArr = pathArr.map(function(item){
        return 'myRelease/' + item
    })
    //
    pathArr.forEach(function(item){
        var project = JSON.parse(fs.readFileSync(path.join(item,'project.json'), 'utf8'));
        var jsList = project.jsList
        jsList = jsList.map(function(i){
            return item + '/' + i
        })

        gulp.src(jsList, {base: item})
        .pipe(sourceMap.init())
        .pipe(concat('layer.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true//类型：Boolean 默认：true 是否完全压缩
            // preserveComments: "license" //保留版权注释
        }))
        // .pipe( sourceMap.write('.',{addComment: false}) )
        .pipe(gulp.dest(item + '/src'));

        var str_project = JSON.stringify(project, null, '\t');
        fs.writeFileSync(path.join(item,'__project.json'), str_project, 'utf8', (err) => {
            if (err) throw err;
            console.log('done');
        });

        project.jsList = ['src/layer.min.js']
        str_project = JSON.stringify(project, null, '\t');
        fs.writeFileSync(path.join(item,'project.json'), str_project, 'utf8', (err) => {
            if (err) throw err;
            console.log('done');
        });
    })

    return true
})

// gulp.task('gulpbrowserify', ['jscompress'], () => {
//     var pathArr = fs.readdirSync('myRelease/')
//     pathArr = pathArr.filter(function(item){
//         if(item !== '.git' && item !== '.DS_Store'){
//             return true
//         } 
//     })
//     pathArr = pathArr.map(function(item){
//         return 'myRelease/' + item
//     })
//     //
//     pathArr.forEach(function(item){
//         gulp.src(item + '/util.js')
//             .pipe(rename('__util.js'))
//             .pipe(gulp.dest(item));

//         browserify({
//           entries: item + '/util.require.js'  //指定打包入口文件
//         })
//         .plugin(standalonify, {  //使打包后的js文件符合UMD规范并指定外部依赖包
//         name: 'util',
//         deps: {
//             // 'nornj': 'nj',
//             // 'react': 'React',
//             // 'react-dom': 'ReactDOM'
//         }
//         })
//         .bundle()  //转换为gulp能识别的流
//         .pipe(source("util.js"))
//         // .pipe(babel({
//         //     presets: ['es2015']
//         // }))
//         // .pipe(uglify({
//         //     mangle: true,//类型：Boolean 默认：true 是否修改变量名
//         //     compress: true//类型：Boolean 默认：true 是否完全压缩
//         //     // preserveComments: "license" //保留版权注释
//         // }))
//         // // .pipe(buffer())  //将vinyl对象内容中的Stream转换为Buffer
//         .pipe(gulp.dest(item));  //输出打包后的文件

//         gulp.src(item + '/util.js')
//         .pipe(sourceMap.init())
//         .pipe(concat('util.min.js'))
//         .pipe(uglify({
//             mangle: true,//类型：Boolean 默认：true 是否修改变量名
//             compress: true//类型：Boolean 默认：true 是否完全压缩
//             // preserveComments: "license" //保留版权注释
//         }))
//         // .pipe( sourceMap.write('.',{addComment: false}) )
//         .pipe(gulp.dest(item));
//     })
    
//     return true
// })

gulp.task('getMy', ['jscompress'], () => {//util.js bable2es5 
    console.log('完成。')
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

gulp.task('jsc', () => {
    return gulp.src('myRelease/cocos2d.js')
        .pipe(concat('cocos2d.js'))
        .pipe(uglify({output:{ 
            // comments:/.license./ 
        }}))
        .pipe(gulp.dest('cocos/'));
})
///////////////////////
const jsSrc = 'js/*.js'
const cssSrc = 'css/*.css'
const htmlSrc = '*.html'
const imgSrc = 'img/*.{jpg,png,gif,ico}'

// gulp.task('img', function () {
//   return gulp.src(imgSrc)
//     .pipe(imagemin())
//     .pipe(gulp.dest('dist/img'))
// })

gulp.task('copy', function () {
  return gulp.src([
    '**/*.*',
    '!img/**/*.*',
    '!js/**/*.*',
    '!rev/**/*.*',
    '!css/**/*.*',
    '!node_modules/**/*.*',
    '!gulpfile.js',
    '!package.json'
  ])
    .pipe(gulp.dest('dist'))
})

gulp.task('html', function() {
  return gulp.src(htmlSrc)
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'))
});

gulp.task('css', function () {
  return gulp.src(cssSrc)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],      // 浏览器版本
      cascade: true,                       // 美化属性，默认true
      add: true,                           // 是否添加前缀，默认true
      remove: true,                        // 删除过时前缀，默认true
      flexbox: true                       // 为flexbox属性添加前缀，默认true
    }))
    .pipe(minifyCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'))
})

////////////////
//图片压缩1 (感觉压缩程度不够)
gulp.task('imagemin', function () {
    gulp.src(imgSrc)
        .pipe(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,    //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true,     //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true       //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(function(file) { return file.base; }))
});

//压缩图片2 (需要有KEY,并且每个月只有500张)
gulp.task('tinypng', ['imagemin'], function() {
    gulp.src(imgSrc)
        .pipe(tinypng({
            key: 'RbcjdCSH0DqwgCn1RmGq0dt6CNLdNDqh',
            sigFile: imgSrc + '/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest(function(file) { return file.base; }));
})

//压缩图片3 (免费 常用)
gulp.task('imgCompress', ['tinypng'], function() {
    gulp.src(imgSrc)
        .pipe(tinypng_nokey ())
        .pipe(gulp.dest(function(file) { return file.base; }));
})

// gulp.task('imgCompress', function () {
//     runSequence(
//         'compress_img',
//         'tinypng',
//         'tp');
// });



