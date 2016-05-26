import alt from '../libs/alt';
import _ from 'lodash';
import GameActions from '../actions/GameActions';

import clefRanges from '../clefRanges.json';

class GameStore {

  constructor() {
    this.bindActions(GameActions);

    this.clef = 'treble';
    this.accidentals = ['flat'];
    this.rangeDifficulty = 'hard';
    this.possibleNotes = this._rangeToNotes(clefRanges[this.clef][this.rangeDifficulty]);
    this.note = _.sample(this.possibleNotes);

    this.answerDelay = 1500;
    this.guessStatus = false;

    this.correct = [];
    this.incorrect = [];

  }

  _rangeToNotes(range, accidentals) {
    let low = range.low;
    let high = range.high;
    let notes = [];
    while (low.pitch !== high.pitch || low.octave !== high.octave) {
      notes.push(this._enharmonicNames(low, accidentals));
      if (low.pitch === 'B') {
        low = {
          pitch: "C",
          octave: low.octave + 1
        };
      } else if (low.pitch === 'G') {
        low = {
          pitch: 'Ab',
          octave: low.octave
        }
      } else if (low.pitch === 'E') {
        low = {
          pitch: "F",
          octave: low.octave
        };
      } else if (low.pitch[1] === 'b') {
        low = {
          pitch: low.pitch[0],
          octave: low.octave
        };
      } else {
        low = {
          pitch: String.fromCharCode(low.pitch.charCodeAt(0) + 1) + 'b',
          octave: low.octave
        }
      }
    }
    return notes;
  }

  _enharmonicNames(note, accidentals) {
    return note;
  }

  guessNote(note) {

    const newNote = () => {
      setTimeout(() => {
        this.setState({
          guessStatus: false,
          note: _.sample(this.possibleNotes)
        });
      }, this.answerDelay);
    };

    // pitch and octave are equal  or the input has no octave and the pitches are equal
    if (_.isEqual(note, this.note) || (note.octave === null && note.pitch === this.note.pitch)) {

      const correct = this.correct.concat(this.note);
      this.setState({
        correct,
        guessStatus: 'correct'
      });
      newNote();

    } else {

      const incorrect = this.incorrect.concat(this.note);
      const guessStatus = {
        incorrect: note,
        correct: this.note
      };
      this.setState({incorrect, guessStatus});
      newNote();

    }

  }
}

export default alt.createStore(GameStore, 'GameStore');
