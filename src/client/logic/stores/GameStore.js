import alt from '../libs/alt';
import _ from 'lodash';

import clefRanges from '../libs/clefRanges.json';
import GameActions from '../actions/GameActions';

export class UnwrappedGameStore {

  constructor() {
    this.bindActions(GameActions);

    this.accidentals = ['flat'];
    this.inputNotes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

    this.clefs = ['treble'];
    this.difficulty = 'hard';
    this.mode = 'practice';
    this.screen = 'staves';
    this.fadeCurDisplay = false;
    this.fadeDisplayTime = 1000;
    this.timedTimeoutId = null;

    this.curStaff = this._newStaff(this.clefs, this.difficulty);
    this.lastStaff = null;

    this.answerDelay = 1500;
    this.guessStatus = null; // Contains info about a guess for answerDelay long after guess, then reset to null

    this.correct = [];
    this.incorrect = [];
    this.score = 0;

    this.exportPublicMethods({
      getMode: () => this.mode,
      getClefs: () => this.clefs,
      getDifficulty: () => this.difficulty,
      getScore: () => this.score
    });

  }

  setNewOption([setting, active]) {
    if (!_.isEqual(this[setting], active)) {
      if (setting === 'mode') {

        this.setState({fadeCurDisplay: true});
        setTimeout(() => {
          if (active == 'timed') {
            this._setStartScreen();
          } else {
            this.setState({
              fadeCurDisplay: false,
              mode: 'practice',
              screen: 'staves',
              curStaff: this._newStaff(this.clefs, this.difficulty),
              lastStaff: null,
              correct: [],
              incorrect: [],
              score: 0
            });
          }
        }, this.fadeDisplayTime);

      } else { // Reset staffs w/ new parameters
        this.setState({
          lastStaff: null,
          curStaff: null,
        });

        const newSetting = {};
        newSetting[setting] = active;
        setTimeout(() => this.setState({
          lastStaff: null,
          curStaff: this._newStaff(
            setting === 'clefs' ? active : this.clefs,
            setting === 'difficulty' ? active : this.difficulty),
          correct: [],
          incorrect: [],
          score: 0,
          ...newSetting
        }), 0);
      }
    }
  }

  guessNote(guessedNote) {
    if (!this.guessStatus) { // If not in animation delay
      if (_.isEqual(guessedNote, this.curStaff.note) || (guessedNote.octave === null && guessedNote.pitch === this.curStaff.note.pitch)) {
        const correct = this.correct.concat(this.curStaff.note);
        this.setState({
          correct,
          score: this._score(correct, this.incorrect),
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
          score: this._score(this.correct, incorrect),
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

  startTimed() {
    this.setState({fadeCurDisplay: true});
    const timedTimeoutId = setTimeout(() => {
      this.setState({
        fadeCurDisplay: false,
        screen: 'staves',
        curStaff: this._newStaff(this.clefs, this.difficulty),
        timedTimeoutId
      });
    }, this.fadeDisplayTime);
  }

  stopTimed() {
    clearTimeout(this.timedTimeoutId);
    this.setState({fadeCurDisplay: true});
    setTimeout(() => {
      this._setStartScreen();
    }, this.fadeDisplayTime);
  }

  // --------------------------------------------------------------------------
  // Internal Methods

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
    let clef = _.sample(this.clefs);
    let note = this._newNote(clef, this.difficulty);
    while(_.isEqual(note, this.curStaff.note)) {
      clef = _.sample(this.clefs);
      note = this._newNote(clef, this.difficulty);
    }
    this.setState({
      guessStatus: null,
      lastStaff: this.curStaff,
      curStaff: {
        clef,
        note,
        noteStatus: ''
      }
    });
  }

  _newStaff(clefs, difficulty) {
    const clef = _.sample(clefs);
    return {
      clef,
      note: this._newNote(clef, difficulty),
      noteStatus: ''
    }
  }

  _newNote(clef, difficulty) { // Return note in cleff/difficulty passed or randomly out of this.clefs
    return _.sample(this._rangeToNotes(clefRanges[clef][difficulty]));
  }

  _setStartScreen() {
    this.setState({
      fadeCurDisplay: false,
      timedTimeoutId: null,
      mode: 'timed',
      screen: 'start',
      curStaff: null,
      lastStaff: null,
      correct: [],
      incorrect: [],
      score: 0
    });
  }

  _score(correct, incorrect) {
    return correct.length*10 - incorrect.length*20;
  }

}

export default alt.createStore(UnwrappedGameStore, 'GameStore');
