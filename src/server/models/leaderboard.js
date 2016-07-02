var mongoose = require('mongoose');

var LeaderboardEntry = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  }

var Leaderboard = new mongoose.Schema({
  clefs: {
    type: Array,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  entries: [LeaderboardEntry]
});
