var News = require("../models/News.js"),
    express = require("express"),
    _ = require("underscore"),
    router = express.Router();

router.route('/saveNews').get(function(req, res, next) {

    var timestamp = Date.parse(new Date()) / 1000;
    var random = Math.round(Math.random() * 100000);
    newsId = timestamp + "" + random;

    var NewsEntity = {
        newsName: req.query.newsName,
        newsId: newsId,
        newsTitle: req.query.newsTitle,
        newsContent: req.query.newsContent,
        updatedTime: new Date(),
        createdTime: new Date(),
        newsAuthor: 'Rex',
        newsLevel: '1',
        newsFlag: 0
    };
    news = new News(NewsEntity);
    news.save(function(err, doc) {
        if (err) {
            console.log("Error!");
            res.jsonp(500, "Error");
        } else {
            res.header('Content-type', 'application/json');
            res.header('Charset', 'utf8');
            res.jsonp(doc);
        }
    });
});

router.get('/getNewsDetail', function(req, res, next) {
    var conditions = {
        newsId: req.query.newsId
    };

    var newsSummary = {};
    news = new News(newsSummary);
    news.findNews(conditions, function(err, news, total) {
        if (err) {
            news = [];
        }
        news.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(news);
    });
});

router.get('/getNewsCollection', function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
    var conditions = {};

    var newsSummary = {};
    news = new News(newsSummary);
    news.findNews(conditions, function(err, news, total) {
        if (err) {
            news = [];
        }
        news.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(news);
    });
});

router.get('/updateNewsCollection', function(req, res, next) {
    var conditions = req.query.conditions;
    var update = req.query.update;
    var results = {};
    news = new News(results);
    news.updateNews(conditions, update, function(err, news, total) {
        if (err) {
            news = [];
        }
        news.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(news);
    });
});

module.exports = router;
