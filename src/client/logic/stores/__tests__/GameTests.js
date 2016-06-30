jest.unmock('../GameStore');
jest.unmock('../../actions/GameActions');

import alt from '../../libs/alt';

import GameActions from '../../actions/GameActions';
import GameStore from '../GameStore';

describe('GameStore API', () => {

  it('starts with the correct defaults', () => {
    const state = GameStore.getState();
    expect(state.clefs).toEqual(['treble']);
    expect(state.difficulty).toBe('hard');
    expect(state.mode).toBe('practice');
    expect(state.screen).toBe('staves');
    expect(state.fadeCurDisplay).toBe(false);
    expect(state.guessStatus).toBeNull();
    expect(state.correct).toEqual([]);
    expect(state.incorrect).toEqual([]);
    expect(state.numGuesses).toBe(0);
    expect(Object.keys(state.curStaff)).toEqual(['clef', 'note', 'noteStatus']);
  });

  describe('guessNote()', () => {

    it('handles a correct guess', () => {
      const curNote = GameStore.getState().curStaff.note;
      alt.dispatcher.dispatch({
        data: curNote,
        action: GameActions.GUESS_NOTE
      });

      let state = GameStore.getState();
      const initStaff = state.curStaff;
      expect(state.guessStatus.guess).toBe('correct');
      expect(state.guessStatus.incorrect).toBeNull();
      expect(state.guessStatus.correct).toEqual(curNote);
      expect(state.numGuesses).toBe(1);

      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.lastStaff).toEqual(initStaff);
      expect(state.curStaff).not.toEqual(initStaff);
      expect(state.guessStatus).toBeNull();
    });

    it ('handles an incorrect guess', () => {

      const initStaff = GameStore.getState().curStaff;
      const initNote = initStaff.note;
      const wrongNote = {
        pitch: initNote.pitch[0] === 'G' ? 'F' : 'G',
        octave: initNote.octave
      };
      alt.dispatcher.dispatch({
        data: wrongNote,
        action: GameActions.GUESS_NOTE
      });

      let state = GameStore.getState();
      expect(state.guessStatus.guess).toBe('incorrect');
      expect(state.guessStatus.incorrect).toEqual(wrongNote);
      expect(state.guessStatus.correct).toEqual(initNote);
      expect(state.numGuesses).toBe(2);

      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.lastStaff.note).toEqual(initNote);
      expect(state.curStaff).not.toEqual(initStaff);
      expect(state.guessStatus).toBeNull();
    });

  });

  describe('setNewOption()', () => {

    it('updates mode', () => {
      let state = GameStore.getState();
      expect(state.mode).toBe('practice');

      alt.dispatcher.dispatch({
        data: ['mode', 'timed'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.mode).toBe('timed');

      alt.dispatcher.dispatch({
        data: ['mode', 'practice'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.mode).toBe('practice');
    });

    it('updates clefs', () => {
      let state = GameStore.getState();
      expect(state.clefs).toEqual(['treble']);

      alt.dispatcher.dispatch({
        data: ['clefs', ['treble']],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.clefs).toEqual(['treble']);
    });

    it('updates difficulty', () => {
      let state = GameStore.getState();
      expect(state.difficulty).toBe('hard');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'easy'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.difficulty).toBe('easy');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'medium'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.difficulty).toBe('medium');
    });

    describe('updating mode', () => {

      function testModeState(state, mode, screen, fade) {
        expect(state.mode).toBe(mode);
        expect(state.screen).toBe(screen);
        expect(state.fadeCurDisplay).toBe(fade);
      }

      it('updates practice to timed', () => {
        let state = GameStore.getState();
        testModeState(state, 'practice', 'staves', false);

        alt.dispatcher.dispatch({
          data: ['mode', 'timed'],
          action: GameActions.SET_NEW_OPTION
        });

        state = GameStore.getState();
        testModeState(state, 'practice', 'staves', true);

        jest.runAllTimers();

        state = GameStore.getState();
        testModeState(state, 'timed', 'start', false);
      });

      it('updates times to practice', () => {
        alt.dispatcher.dispatch({
          data: ['mode', 'practice'],
          action: GameActions.SET_NEW_OPTION
        });

        let state = GameStore.getState();
        testModeState(state, 'timed', 'start', true);

        jest.runAllTimers();

        state = GameStore.getState();
        testModeState(state, 'practice', 'staves', false);
      });

    });

    it('doesn\'t update the staff if the mode isn\'t new', () => {

      let state = GameStore.getState();
      const initStaff = state.curStaff;
      expect(state.mode).toBe('practice');

      alt.dispatcher.dispatch({
        data: ['mode', 'practice'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.curStaff).toEqual(initStaff);

    });

    it('doesn\'t update the staff if the clefs aren\'t new', () => {

      let state = GameStore.getState();
      const initStaff = state.curStaff;
      expect(state.clefs).toEqual(['treble']);

      alt.dispatcher.dispatch({
        data: ['clefs', ['treble']],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.curStaff).toEqual(initStaff);

    });

    it('doesn\'t update the staff if the difficulty isn\'t new', () => {

      let state = GameStore.getState();
      const initStaff = state.curStaff;
      expect(state.difficulty).toBe('medium');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'medium'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      state = GameStore.getState();
      expect(state.curStaff).toEqual(initStaff);

    });

  });

});
