import alt from '../libs/alt';
import _ from 'lodash';

import clefRanges from '../libs/clefRanges.json';
import GameActions from '../actions/GameActions';


class GameStore {

  constructor() {
    this.bindActions(GameActions);

    this.accidentals = ['flat'];
    this.inputNotes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

    this.mode = 'practice';
    this.clefs = ['treble'];
    this.difficulty = 'hard';

    const clef = _.sample(this.clefs);
    this.curStaff = {
      clef,
      note: this._newNote(clef, this.difficulty),
      noteStatus: ''
    }
    this.lastStaff = null;

    this.answerDelay = 1500;
    this.guessStatus = null; // Contains info about a guess for answerDelay, then reset to null

    this.correct = [];
    this.incorrect = [];

    this.exportPublicMethods({
      getMode: () => this.mode,
      getClefs: () => this.clefs,
      getDifficulty: () => this.difficulty
    });

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

  _rangeToNotes(range, accidentals) { // Take a range defined by a high and low note and return an array of notes in the range
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
    let note = this._newNote();
    while(_.isEqual(note, this.curStaff.note)) {
      note = this._newNote();
    }
    this.setState({
      guessStatus: null,
      lastStaff: this.curStaff,
      curStaff: {
        clef: 'treble',
        note,
        noteStatus: ''
      }
    });
  }

  _newNote(clef, difficulty) { // Return note in cleff/difficulty passed or randomly out of this.clefs
    if (arguments.length !== 0) {
      return _.sample(this._rangeToNotes(clefRanges[clef][difficulty]));
    }
    return _.sample(this._rangeToNotes(clefRanges[_.sample(this.clefs)][this.difficulty]));
  }

}

export default alt.createStore(GameStore, 'GameStore');
