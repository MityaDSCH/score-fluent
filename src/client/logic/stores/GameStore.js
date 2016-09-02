'use strict';

import alt from '../libs/alt';
import _ from 'lodash';

import clefRanges from '../libs/clefRanges.json';
import { toFlat, toSharp, areEnharmonic } from '../../libs/enharmonics'
import GameActions from '../actions/GameActions';
import MenuActions from '../actions/MenuActions';

export class UnwrappedGameStore {

  constructor() {
    this.bindActions(GameActions);

    this.accidental = _.sample(['flat', 'sharp']);
    this.inputNotes = {
      flat: ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'],
      sharp: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    };

    this.clefs = ['treble'];
    this.difficulty = 'hard';
    this.audio = 'piano';
    this.mode = 'practice';
    this.screen = 'staves';
    this.fadeCurDisplay = false;
    this.fadeDisplayTime = 1000;
    this.timedDuration = 60000;
    this.timedTimeoutId = null;

    this.curStaff = this._newStaff(this.clefs, this.difficulty);
    this.lastStaff = null;

    this.answerDelay = 1500;
    this.guessStatus = null; // Contains info about a guess for answerDelay long after guess, then reset to null

    this.correct = [];
    this.incorrect = [];
    this.score = 0;
    this.leaderboard = null;

    this.timeoutIds = [];

    this.exportPublicMethods({
      getFading: () => this.fadeCurDisplay,
      getMode: () => this.mode,
      getScreen: () => this.screen,
      getClefs: () => this.clefs,
      getDifficulty: () => this.difficulty,
      getAudio: () => this.audio,
      getAnswers: () => {
        return {
          correct: this.correct,
          incorrect: this.incorrect
        };
      },
      getScore: () => this.score
    });

  }

  componentWillUnmount() {
    this.state.timeoutIds.forEach(id => clearTimeout(id));
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
    // If last guess isn't still animating
    if (!this.guessStatus) {

      // If guess is correct (pitch is correct and octave is undefined for this input or correct)
      const samePitch = areEnharmonic(guessedNote.pitch, this.curStaff.note.pitch)
      if (!guessedNote.octave && samePitch || (guessedNote.octave === this.curStaff.note.octave && samePitch)) {
        const correct = this.correct.concat(this.curStaff.note);
        this.setState({
          correct,
          score: this._score(correct, this.incorrect),
          guessStatus: {
            guess: 'correct',
            incorrect: null,
            correct: this.curStaff.note
          },
          curStaff: {...this.curStaff, noteStatus: 'correct'}
        });
        this._setRandNote();

      // If guess is incorrect
      } else {
        const incorrect = this.incorrect.concat(this.curStaff.note);
        this.setState({
          incorrect,
          score: this._score(this.correct, incorrect),
          guessStatus: {
            guess: 'incorrect',
            incorrect: {...guessedNote, octave: guessedNote.octave || this.curStaff.note.octave},
            correct: this.curStaff.note
          },
          curStaff: {...this.curStaff, noteStatus: 'incorrect'}
        });

        // Wait 2x as long to set new note to allow incorrect note animation
        this._setRandNote(2);
      }
    }
  }

  startTimed() {
    // Fade start screen
    this.setState({fadeCurDisplay: true});
    setTimeout(() => {
      // Then set timer for end of timed game
      const timedTimeoutId = setTimeout(() => {
        // After timedDuration fade out staves screen
        this.setState({fadeCurDisplay: true});
        setTimeout(() => {
          // and fade in score screen
          this._setScoreScreen();
        }, this.fadeDisplayTime);
      }, this.timedDuration);
      // and fade in staves for timedDuration
      this.setState({
        fadeCurDisplay: false,
        screen: 'staves',
        curStaff: this._newStaff(this.clefs, this.difficulty),
        correct: [],
        incorrect: [],
        score: 0,
        leaderboard: null,
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

  logScore(leaderboard) {
    this.setState({leaderboard});
  }

  setNote(pitch) {
    this.setState({
      curStaff: {...this.curStaff, note: {pitch, octave: null}}
    });
  }

  // --------------------------------------------------------------------------
  // Internal Methods

  _rangeToNotes(range) { // Take a range defined by a high and low note and return an array of notes in the range
    let low = range.low;
    let high = range.high;
    let notes = [];
    while (low.pitch !== high.pitch || low.octave !== high.octave) {
      notes.push(low);
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
    return notes
  }

  _setRandNote(length = 1) {
    const timeout = setTimeout(() => {
      // ...
      if (this.timeoutIds) {
        let accidental = _.sample(['flat', 'sharp']);
        this.setState({accidental});
        let clef = _.sample(this.clefs);
        let note = this._newNote(clef, this.difficulty, accidental);
        while(this.curStaff && _.isEqual(note, this.curStaff.note)) {
          clef = _.sample(this.clefs);
          note = this._newNote(clef, this.difficulty, accidental);
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
    }, this.answerDelay * length);
    this.setState({
      timeoutIds: this.timeoutIds.concat(timeout)
    });
  }

  _newStaff(clefs, difficulty) {
    const clef = _.sample(clefs);
    const accidental = _.sample(['flat', 'sharp']);
    return {
      clef,
      note: this._newNote(clef, difficulty, accidental),
      noteStatus: ''
    }
  }

  _newNote(clef, difficulty, accidental) {
    const range = _.cloneDeep(clefRanges[clef][difficulty]);
    const randNote = _.sample(this._rangeToNotes(range));

    // Return enharmonic sharp 50% of the time
    return {
      ...randNote,
      pitch: accidental == 'flat' ? toFlat(randNote.pitch) : toSharp(randNote.pitch)
    };

    return randNote;
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
    return correct.length*10 - incorrect.length*10;
  }

  _setScoreScreen() {
    this.setState({
      fadeCurDisplay: false,
      timedTimeoutId: null,
      screen: 'score',
      curStaff: null,
      lastStaff: null,
      leaderboard: null
    });
    MenuActions.removeTimedMenu();
  }

}

export default alt.createStore(UnwrappedGameStore, 'GameStore');
