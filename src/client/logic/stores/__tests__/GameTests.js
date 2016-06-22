jest.unmock('../GameStore');
jest.unmock('../../actions/GameActions');

import alt from '../../libs/alt';

import GameActions from '../../actions/GameActions';
import GameStore from '../GameStore';

describe('GameStore API', () => {

  it('starts with the correct defaults', () => {
    const storeState = GameStore.getState();
    expect(storeState.mode).toBe('practice');
    expect(storeState.clefs).toEqual(['treble']);
    expect(storeState.difficulty).toBe('hard');
    expect(storeState.guessStatus).toBeNull();
    expect(storeState.correct).toEqual([]);
    expect(storeState.incorrect).toEqual([]);
    expect(storeState.numGuesses).toBe(0);
    expect(Object.keys(storeState.curStaff)).toEqual(['clef', 'note', 'noteStatus']);
  });

  describe('guessNote()', () => {

    it('handles a correct guess', () => {
      const curNote = GameStore.getState().curStaff.note;
      alt.dispatcher.dispatch({
        data: curNote,
        action: GameActions.GUESS_NOTE
      });

      let storeState = GameStore.getState();
      const initStaff = storeState.curStaff;
      expect(storeState.guessStatus.guess).toBe('correct');
      expect(storeState.guessStatus.incorrect).toBeNull();
      expect(storeState.guessStatus.correct).toEqual(curNote);
      expect(storeState.numGuesses).toBe(1);

      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.lastStaff).toEqual(initStaff);
      expect(storeState.curStaff).not.toEqual(initStaff);
      expect(storeState.guessStatus).toBeNull();
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

      let storeState = GameStore.getState();
      expect(storeState.guessStatus.guess).toBe('incorrect');
      expect(storeState.guessStatus.incorrect).toEqual(wrongNote);
      expect(storeState.guessStatus.correct).toEqual(initNote);
      expect(storeState.numGuesses).toBe(2);

      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.lastStaff.note).toEqual(initNote);
      expect(storeState.curStaff).not.toEqual(initStaff);
      expect(storeState.guessStatus).toBeNull();
    });

  });

  describe('setNewOption()', () => {

    it('updates mode', () => {
      let storeState = GameStore.getState();
      expect(storeState.mode).toBe('practice');

      alt.dispatcher.dispatch({
        data: ['mode', 'timed'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.mode).toBe('timed');

      alt.dispatcher.dispatch({
        data: ['mode', 'practice'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.mode).toBe('practice');
    });

    it('updates clefs', () => {
      let storeState = GameStore.getState();
      expect(storeState.clefs).toEqual(['treble']);

      alt.dispatcher.dispatch({
        data: ['clefs', ['treble']],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.clefs).toEqual(['treble']);
    });

    it('updates difficulty', () => {
      let storeState = GameStore.getState();
      expect(storeState.difficulty).toBe('hard');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'easy'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.difficulty).toBe('easy');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'medium'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.difficulty).toBe('medium');
    });

    it('doesn\'t update the staff if the mode isn\'t new', () => {

      let storeState = GameStore.getState();
      const initStaff = storeState.curStaff;
      expect(storeState.mode).toBe('practice');

      alt.dispatcher.dispatch({
        data: ['mode', 'practice'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.curStaff).toEqual(initStaff);

    });

    it('doesn\'t update the staff if the clefs aren\'t new', () => {

      let storeState = GameStore.getState();
      const initStaff = storeState.curStaff;
      expect(storeState.clefs).toEqual(['treble']);

      alt.dispatcher.dispatch({
        data: ['clefs', ['treble']],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.curStaff).toEqual(initStaff);

    });

    it('doesn\'t update the staff if the difficulty isn\'t new', () => {

      let storeState = GameStore.getState();
      const initStaff = storeState.curStaff;
      expect(storeState.difficulty).toBe('medium');

      alt.dispatcher.dispatch({
        data: ['difficulty', 'medium'],
        action: GameActions.SET_NEW_OPTION
      });
      jest.runAllTimers();

      storeState = GameStore.getState();
      expect(storeState.curStaff).toEqual(initStaff);

    });

  });

});
