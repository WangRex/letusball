var Match = require("../models/Match.js"),
    express = require("express"),
    _ = require("underscore"),
    router = express.Router();

router.route('/saveMatch').get(function(req, res, next) {

    var timestamp = Date.parse(new Date()) / 1000;
    var random = Math.round(Math.random() * 100000);
    matchId = timestamp + "" + random;

    var MatchEntity = {
        matchTitle: req.query.matchTitle,
        matchId: matchId,
        matchContent: req.query.matchContent,
        matchTeamA: req.query.matchTeamA,
        matchTeamB: req.query.matchTeamB,
        matchTeamAID: req.query.matchTeamAID,
        matchTeamBID: req.query.matchTeamBID,
    };
    match = new Match(MatchEntity);
    match.save(function(err, doc) {
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

router.get('/getMatchDetail', function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
    var conditions = {
        matchId: req.query.matchId
    };

    var matchSummary = {};
    match = new Match(matchSummary);
    match.findMatch(conditions, function(err, match, total) {
        if (err) {
            match = [];
        }
        match.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(match);
    });
});

router.get('/getMatchCollection', function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
    var conditions = {};

    var matchSummary = {};
    match = new Match(matchSummary);
    match.findMatch(conditions, function(err, match, total) {
        if (err) {
            match = [];
        }
        match.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(match);
    });
});

router.get('/getMatchCollectionRefresh', function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
    var conditions = {};
    if (req.query.createdTime) {
        conditions = {"createdTime": {"$gte":req.query.createdTime}};
    };
    var skip = req.query.skip || 0;
    var limit = req.query.limit || 0;

    var matchSummary = {};
    match = new Match(matchSummary);
    match.findMatchLimit(conditions, skip, limit, function(err, match, total) {
        if (err) {
            match = [];
        }
        match.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(match);
    });
});

router.get('/updateMatchCollection', function(req, res, next) {
    var conditions = req.query.conditions;
    var update = req.query.update;
    var results = {};
    match = new Match(results);
    match.updateMatch(conditions, update, function(err, match, total) {
        if (err) {
            match = [];
        }
        match.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(match);
    });
});

module.exports = router;
