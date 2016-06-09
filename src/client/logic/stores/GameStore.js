import alt from '../libs/alt';
import _ from 'lodash';

import clefRanges from '../libs/clefRanges.json';
import GameActions from '../actions/GameActions';


class GameStore {

  constructor() {
    this.bindActions(GameActions);

    this.accidentals = ['flat'];
    this.inputNotes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

    this.curStaff = {
      clef: 'treble',
      note: _.sample(this._rangeToNotes(clefRanges['treble']['hard'])),
      noteStatus: ''
    }
    this.lastStaff = null;

    this.answerDelay = 1500;
    this.guessStatus = null; // Contains info about a guess for answerDelay, then reset to null

    this.correct = [];
    this.incorrect = [];

  }

  guessNote(guessedNote) {
    if (!this.guessStatus) { // If not in animation delay
      if (_.isEqual(guessedNote, this.curStaff.note) || (guessedNote.octave === null && guessedNote.pitch === this.curStaff.note.pitch)) {
        const correct = this.correct.concat(this.curStaff.note);
        this.setState({
          correct,
          guessStatus: {
            guess: 'correct',
            incorrect: null,
            correct: guessedNote
          },
          curStaff: {...this.curStaff, noteStatus: 'correct'}
        });
      } else {
        const incorrect = this.incorrect.concat(this.curStaff.note);
        this.setState({
          incorrect,
          guessStatus: {
            guess: 'incorrect',
            incorrect: guessedNote,
            correct: this.curStaff.note
          },
          curStaff: {...this.curStaff, noteStatus: 'incorrect'}
        });
      }

      setTimeout(() => {
        this._setRandNote();
      }, this.answerDelay);

    }
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

  _setRandNote() {
    let newNote = this._rangeToNotes(clefRanges['treble']['hard']);
    while(_.isEqual(newNote, this.curStaff.note)) {
      newNote = this._rangeToNotes(clefRanges['treble']['hard']);
    }
    this.setState({
      guessStatus: null,
      lastStaff: this.curStaff,
      curStaff: {
        clef: 'treble',
        note: _.sample(this._rangeToNotes(clefRanges['treble']['hard'])),
        noteStatus: ''
      }
    });
  }

}

export default alt.createStore(GameStore, 'GameStore');
