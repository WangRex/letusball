/**
* 球赛市场 match
*
*/

var mongoose = require('./db'),
    _ = require("underscore"),
    Schema = mongoose.Schema,
    util = require("util");
var MatchSchema = new Schema({
    id: Schema.Types.ObjectId,
    matchId: String,
    matchTitle: String,
    matchContent: Schema.Types.Mixed,
    updatedTime: {
        type: Date,
        default: Date.now
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    matchDate: {
        type: Date,
        default: Date.now
    }, //比赛日期
    matchTeamA: String, // 球队A的名称
    matchTeamB: String, //球队B的名称
    matchTeamAID: String, // 球队A的ID为了关联出A球队
    matchTeamBID: String, //球队B的ID为了关联出B球队
});

var MatchModel = mongoose.model('match', MatchSchema);

function Match(match) {
    this.matchId = match.matchId;
    this.matchTitle = match.matchTitle;
    this.matchContent = match.matchContent;
    this.matchDate = match.matchDate;
    this.matchTeamA = match.matchTeamA;
    this.matchTeamB = match.matchTeamB;
    this.matchTeamAID = match.matchTeamAID;
    this.matchTeamBID = match.matchTeamBID;
}


//save match
Match.prototype.save = function(callback) {
    //the doc to save
    var match = {
        matchId: this.matchId,
        matchTitle: this.matchTitle,
        matchContent: this.matchContent,
        matchDate: this.matchDate,
        matchTeamA: this.matchTeamA,
        matchTeamB: this.matchTeamB,
        matchTeamAID: this.matchTeamAID,
        matchTeamBID: this.matchTeamBID,
    };
    var conditions = {
        matchId: match.matchId
    };
    MatchModel.findOne(conditions, function(err, doc) {
        if (doc === null) {
            var matchModel = new MatchModel(match);
            matchModel.save(function() {
                callback(err, matchModel);
            });
        } else {
            doc.matchId = match.matchId;
            doc.matchTitle = match.matchTitle;
            doc.matchContent = match.matchContent;
            doc.matchDate = match.matchDate;
            doc.matchTeamA = match.matchTeamA;
            doc.matchTeamB = match.matchTeamB;
            doc.matchTeamAID = match.matchTeamAID;
            doc.matchTeamBID = match.matchTeamBID;

            doc.save(function() {
                callback(err, doc);
            });
        }
    });
};

Match.prototype.findMatch = function(conditions, callback) {
    // executing a query explicitly
    var query1 = MatchModel.find(conditions, "matchId matchTitle matchContent matchDate matchTeamA matchTeamB matchTeamAID matchTeamBID");
    var query2 = MatchModel.find(conditions);
    query1.exec(function(err, docs) {
        query2.count(function(errs, count) {
            callback(err, docs, count);
        });
    });

};

Match.prototype.updateMatch = function(conditions, update, options, callback) {
    /*var conditions = {
        name: 'borne'
    },
    update = {
        $inc: {
            visits: 1
        }
    },
    options = {
        multi: false
    };
*/
    var options = {
        multi: false
    };
    MatchModel.update(conditions, update, options, callback);

    function callback(err, numAffected) {
        debugger;
        // numAffected is the number of updated documents
        console.log("the number of updated documents is " + numAffected);
        console.log(util.inspect(numAffected, false, null));
    };
};
module.exports = Match;
