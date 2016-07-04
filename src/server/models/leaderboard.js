var mongoose = require('mongoose');

var LeaderboardEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

var LeaderboardSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true
  },
  clefs: {
    type: Array,
    required: true
  },
  entries: [LeaderboardEntrySchema]
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
