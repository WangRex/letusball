/**
* 球赛市场 matchMarket
*
*/

var mongoose = require('./db'),
    _ = require("underscore"),
    Schema = mongoose.Schema,
    util = require("util");
var MatchMarketSchema = new Schema({
    id: Schema.Types.ObjectId,
    matchMarketId: String,
    matchMarketTitle: String,
    matchMarketContent: Schema.Types.Mixed,
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
    matchMarketTeamA: String, // 球队A的名称
    matchMarketTeamB: String, //球队B的名称
    matchMarketTeamAID: String, // 球队A的ID为了关联出A球队
    matchMarketTeamBID: String, //球队B的ID为了关联出B球队
    matchMarketStatus: String //结束的赛事-->0; 进行中的赛事-->1; 计划赛事-->2.根据matchDate自动生成
    
});

var MatchMarketModel = mongoose.model('matchMarket', MatchMarketSchema);

function MatchMarket(matchMarket) {
    this.matchMarketId = matchMarket.matchMarketId;
    this.matchMarketTitle = matchMarket.matchMarketTitle;
    this.matchMarketContent = matchMarket.matchMarketContent;
    this.matchDate = matchMarket.matchDate;
    this.matchMarketTeamA = matchMarket.matchMarketTeamA;
    this.matchMarketTeamB = matchMarket.matchMarketTeamB;
    this.matchMarketTeamAID = matchMarket.matchMarketTeamAID;
    this.matchMarketTeamBID = matchMarket.matchMarketTeamBID;
    this.matchMarketStatus = matchMarket.matchMarketStatus;
}


//save matchMarket
MatchMarket.prototype.save = function(callback) {
    //the doc to save
    var matchMarket = {
        matchMarketId: this.matchMarketId,
        matchMarketTitle: this.matchMarketTitle,
        matchMarketContent: this.matchMarketContent,
        matchDate: this.matchDate,
        matchMarketTeamA: this.matchMarketTeamA,
        matchMarketTeamB: this.matchMarketTeamB,
        matchMarketTeamAID: this.matchMarketTeamAID,
        matchMarketTeamBID: this.matchMarketTeamBID,
        matchMarketStatus: this.matchMarketStatus
    };
    var conditions = {
        matchMarketId: matchMarket.matchMarketId
    };
    MatchMarketModel.findOne(conditions, function(err, doc) {
        if (doc === null) {
            var matchMarketModel = new MatchMarketModel(matchMarket);
            matchMarketModel.save(function() {
                callback(err, matchMarketModel);
            });
        } else {
            doc.matchMarketId = matchMarket.matchMarketId;
            doc.matchMarketTitle = matchMarket.matchMarketTitle;
            doc.matchMarketContent = matchMarket.matchMarketContent;
            doc.matchDate = matchMarket.matchDate;
            doc.matchMarketTeamA = matchMarket.matchMarketTeamA;
            doc.matchMarketTeamB = matchMarket.matchMarketTeamB;
            doc.matchMarketTeamAID = matchMarket.matchMarketTeamAID;
            doc.matchMarketTeamBID = matchMarket.matchMarketTeamBID;
            doc.matchMarketStatus = matchMarket.matchMarketStatus;

            doc.save(function() {
                callback(err, doc);
            });
        }
    });
};

MatchMarket.prototype.findMatchMarket = function(conditions, callback) {
    // executing a query explicitly
    var query1 = MatchMarketModel.find(conditions, "matchMarketId matchMarketTitle matchMarketContent matchDate matchMarketTeamA matchMarketTeamB matchMarketTeamAID matchMarketTeamBID matchMarketStatus");
    var query2 = MatchMarketModel.find(conditions);
    query1.exec(function(err, docs) {
        query2.count(function(errs, count) {
            callback(err, docs, count);
        });
    });

};

MatchMarket.prototype.updateMatchMarket = function(conditions, update, options, callback) {
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
    MatchMarketModel.update(conditions, update, options, callback);

    function callback(err, numAffected) {
        debugger;
        // numAffected is the number of updated documents
        console.log("the number of updated documents is " + numAffected);
        console.log(util.inspect(numAffected, false, null));
    };
};
module.exports = MatchMarket;
