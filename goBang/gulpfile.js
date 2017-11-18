var gulp = require("gulp"),
    browserSync = require("browser-sync");

//gulp sync 执行任务
gulp.task("sync", function() {
    var files = ["html/*.html", "css/*.css", "js/*.js"];
    //file为初始监测默认设置
    //css 热替换（局部刷新） js html 整个刷新
    //init 为开启小服务器
    //index 标识主页
    //要切换其他页面 浏览器更改文件路径即可
    browserSync.init(files, {
        server: {
            baseDir: "./",
            index: "html/goBang.html",
            // middleware: function(req, res, next) {
            //     console.log("Hi from middleware");
            //     next();
            // }
        },
        port: 8080,
        logPrefix: "goBang Project",
        //在这里你可以禁用/启用 每个单独的功能
        // ghostMode: {
        //     clicks: true,
        //     forms: true,
        //     scroll: false
        // },
        // browser: ["chrome", "firefox"],

        //显示了我对过程的其他信息 
        logLevel: "debug",
        
        // 记录连接
        // logConnections: true
    });
});

/*var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// Save a reference to the `reload` method

// Watch scss AND html files, doing different things with each.
gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("css/*.css").on('change', reload);
    gulp.watch("*.html").on("change", reload);
    gulp.watch("js/*.js").on("change", reload);


});*/
