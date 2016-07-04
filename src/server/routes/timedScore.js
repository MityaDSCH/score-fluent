var _ = require('lodash');

var Leaderboard = require('../models/leaderboard');

// req has form {_id (for user), difficulty, clefs, score}

module.exports = function(app) {
  return function(req, res) {

    var leaderboardBody = {
      difficulty: req.body.difficulty,
      clefs: typeof req.body.clefs === 'string' ? JSON.parse(req.body.clefs) : req.body.clefs
    };

    var newEntry = {
      user: req.body._id,
      score: req.body.score
    };

    // find/create relevant leaderboard and update/create entry
    Leaderboard.findOne(leaderboardBody, function(err, leaderboard) {

      if (leaderboard === null) {
        leaderboard = new Leaderboard(leaderboardBody);
      }

      var curEntries = leaderboard.entries.toObject();

      var curUserEntryIndex = _.findIndex(leaderboard.entries, function(entry) {
        return String(entry.user) == newEntry.user
      });

      if (curUserEntryIndex === -1) {
        leaderboard.entries = binaryInsertEntry(leaderboard.entries, newEntry);
      } else {
        var curEntry = leaderboard.entries[curUserEntryIndex];
        if (req.body.score > curEntry.score) {
          leaderboard.entries.splice(curUserEntryIndex, 1);
          leaderboard.entries = binaryInsertEntry(leaderboard.entries, newEntry);
        }
      }

      leaderboard.save(function(err) {
        if (err) res.json({success: false, err: err});
        else {
          //Find the top 5 scores and return to client in form {success, [{username, score}]}
          Leaderboard
            .findOne(leaderboardBody)
            .slice('entries', 5)
            .populate({
              path: 'entries.user',
              select: 'username'
            })
            .exec(function(err, leaderboard) {
              if (err) res.json({success: false, err: err});
              res.json({
                success: true,
                topScores: leaderboard.entries.map(function(entry) {
                  return {
                    username: entry.user.username,
                    score: entry.score
                  };
                })
              });
            });
        }
      });

    });
  }
}

function binaryInsertEntry(lbEntries, newEntry) {
  // use binary search to find the proper index sort by increasing negative score
  var binaryInsertIndex = _.sortedIndexBy(lbEntries, newEntry, function(entry) {
    return -entry.score;
  });

  lbEntries.splice(binaryInsertIndex, 0, newEntry);

  return lbEntries;
}
