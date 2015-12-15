var mongoose = require('./db'),
    _ = require("underscore"),
    Schema = mongoose.Schema,
    util = require("util");
var FinanceSchema = new Schema({
    id: Schema.Types.ObjectId,
    newsId: String,
    newsName: String,
    newsTitle: String,
    newsContent: Schema.Types.Mixed,
    updatedTime: {
        type: Date,
        default: Date.now
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    newsAuthor: String, // new's author
    newsLevel: String, //new's level
    newsFlag: String, //show or not.
    relateTeam: String
});

var NewsModel = mongoose.model('news', FinanceSchema);

function News(news) {
    this.newsId = news.newsId;
    this.newsName = news.newsName;
    this.newsTitle = news.newsTitle;
    this.newsContent = news.newsContent;
    this.newsAuthor = news.newsAuthor;
    this.newsLevel = news.newsLevel;
    this.newsFlag = news.newsFlag;
    this.relateTeam = news.relateTeam;
}


//save news
News.prototype.save = function(callback) {
    //the doc to save
    var news = {
        newsId: this.newsId,
        newsName: this.newsName,
        newsTitle: this.newsTitle,
        newsContent: this.newsContent,
        newsAuthor: this.newsAuthor,
        updatedTime: new Date(),
        createdTime: new Date(),
        newsLevel: this.newsLevel,
        newsFlag: this.newsFlag,
        relateTeam: this.relateTeam
    };
    var conditions = {
        newsId: news.newsId
    };
    NewsModel.findOne(conditions, function(err, doc) {
        if (doc === null) {
            var newsModel = new NewsModel(news);
            newsModel.save(function() {
                callback(err, newsModel);
            });
        } else {
            doc.newsName = news.newsName;
            doc.newsId = news.newsId;
            doc.newsTitle = news.newsTitle;
            doc.newsContent = news.newsContent;
            doc.updatedTime = news.updatedTime;
            doc.createdTime = news.createdTime;
            doc.newsAuthor = news.newsAuthor;
            doc.newsLevel = news.newsLevel;
            doc.newsFlag = news.newsFlag;
            doc.relateTeam = news.relateTeam;

            doc.save(function() {
                callback(err, doc);
            });
        }
    });
};

News.prototype.findNews = function(conditions, callback) {
    // executing a query explicitly
    var query1 = NewsModel.find(conditions, "newsId newsName newsTitle newsContent");
    var query2 = NewsModel.find(conditions);
    query1.exec(function(err, docs) {
        query2.count(function(errs, count) {
            callback(err, docs, count);
        });
    });

};

News.prototype.updateNews = function(conditions, update, options, callback) {
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
    NewsModel.update(conditions, update, options, callback);

    function callback(err, numAffected) {
        debugger;
        // numAffected is the number of updated documents
        console.log("the number of updated documents is " + numAffected);
        console.log(util.inspect(numAffected, false, null));
    };
};
module.exports = News;
