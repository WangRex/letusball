/*
  Module dependencies:

  - Express
  - Http (to run Express)
  - Underscore (because it's cool)
  - Socket.IO

  It is a common practice to name the variables after the module name.
  Ex: http is the "http" module, express is the "express" module, etc.
  The only exception is Underscore, where we use, conveniently, an
  underscore. Oh, and "socket.io" is simply called io. Seriously, the
  rest should be named after its module name.

*/

var express = require("express"),
    connect = require('connect'),
    app = express(),
    favicon = require('serve-favicon'),
    path = require('path'),
    http = require("http").createServer(app),
    _ = require("underscore"),
    settings = require('./settings'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    mongoose = require('./models/db'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    session = require('express-session'),
    async = require('async'),
    MongoStore = require('connect-mongo')(session),
    //创建文件，返回一个WriteStream（输出流）对象（可写流）。flags可以是以下值
    //r:以读取模式打开文件
    //r+：以读写模式
    //w：以写入模式打开，如果不存在则创建
    //w+：以读写模式打开，如果不存在则创建
    //a:以追加模式打开文件，如果不存在则创建
    //a+:以读取追加模式打开文件，如果文件不存在则创建。
    accessLog = fs.createWriteStream(__dirname + '/access.log', {
        flags: 'a'
    }),
    errorLog = fs.createWriteStream(__dirname + '/error.log', {
        flags: 'a'
    }),
    syncLog = fs.createWriteStream(__dirname + '/syncLog.log', {
        flags: 'a'
    }),
    //加载静态资源
    app.use(express.static(path.join(__dirname, 'public')));
//__dirname是开发期间，该行代码所在的目录
console.log(__dirname);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
//This tells express to log via morgan
//and morgan to log in the "combined" pre-defined format
//That's it. Everything in your snippet after this are just
//other variations your might want to use
//用combined预定义模式把log文件以流的形式写入到accessLog文件中。
app.use(logger('combined', {
    stream: accessLog
}));

app.use(favicon(__dirname + '/favicon.ico'));
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.set("ipaddr", "127.0.0.1");

//Server's port number
app.set("port", 8070);
app.set("env", 'dev');

app.use(function(req, res) {
    res.render("404");
});
app.use(function(err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});
if (app.get('env') === 'production') {
    console.log("set secure to true");
    app.set('trust proxy', 1); // trust first proxy 
    sess.cookie.secure = true; // serve secure cookies 
}
//Start the http server at port and IP defined before
http.listen(app.get("port"), function() {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

//配置路由
var birds = require('./routes/birds'),
    teams = require('./routes/teamControl'),
    routers = require('./routes/index');
app.use('/birds', birds);
app.use('/teams', teams);
app.use('/', routers);
