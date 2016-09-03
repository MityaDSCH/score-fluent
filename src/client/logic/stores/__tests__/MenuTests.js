jest.unmock('../MenuStore');

jest.mock('../../actions/MenuActions');

import alt from '../../libs/alt';

import MenuActions from '../../actions/MenuActions';
import MenuStore from '../MenuStore';

const examplePayload = {
  "_id": "575e2254ff8804df7664323e",
  "username": "asdf",
  "email": "asdf@asdf.com",
  "role": "User",
  "iat": 1466295774,
  "exp": 1497853374
};

function dispatch(data, action) {
  alt.dispatcher.dispatch({data, action});
}

describe('MenuStore API', () => {

  describe('init()', () => {
    it('inits properly when passed a JWT payload', () => {
      dispatch(examplePayload, MenuActions.INIT);
      jest.runAllTimers(); // Sets menu after 200ms delay

      const storeState = MenuStore.getState();
      expect(storeState.items.length).toBe(5);
      expect(storeState.items[0].name).toBe('Hi ' + examplePayload.username + '!');
      expect(storeState.items[1].name).toBe('Logout');
    });

    it('inits properly when not passed a JWT payload', () => {
      dispatch(null, MenuActions.INIT);
      jest.runAllTimers();

      const storeState = MenuStore.getState();
      expect(storeState.items.length).toBe(5);
      expect(storeState.items[0].name).toBe('Login');
      expect(storeState.items[1].name).toBe('Register');
    });
  });

  describe('toggling between menus', () => {

    it('sets the second menu', () => {
      dispatch(['More', null],  MenuActions.BTN_CLICK);
      jest.runAllTimers();

      const storeState = MenuStore.getState();
      expect(storeState.optionsMenu).toBeFalsy();
      expect(storeState.items[0].name).toBe('Difficulty');
      expect(storeState.items[1].name).toBe('Input');
    });

    it('sets a new difficulty using chooseOption()', () => {
      dispatch(['Back', null], MenuActions.BTN_CLICK);
      jest.runAllTimers();

      const storeState = MenuStore.getState();
      expect(storeState.optionsMenu).toBeFalsy();
      expect(storeState.items[0].name).toBe('Login');
      expect(storeState.items[4].name).toBe('More');
    });

  })

  describe('option menus', () => {

    describe('chooseOption() menus', () => {

      describe('mode menu', () => {
        it('sets the mode menu', () => {
          dispatch(['Mode', 'timed'], MenuActions.BTN_CLICK);
          jest.runAllTimers();

          const storeState = MenuStore.getState();
          expect(storeState.optionsMenu).toBeTruthy();
          expect(storeState.rootMenu.name).toBe('_setBaseMenu');
          expect(storeState.items[0].name).toBe('Mode:');
          expect(storeState.items[1].active).toBe(false);
          expect(storeState.items[2].active).toBe(true);
        });

        it('sets a new mode using chooseOption', () => {
          dispatch('Practice', MenuActions.CHOOSE_OPTION);

          let storeState = MenuStore.getState();
          expect(storeState.items[1].active).toBe(true);
          expect(storeState.items[2].active).toBe(false);

          jest.runAllTimers();

          storeState = MenuStore.getState();
          expect(storeState.rootMenu.name).toBe('_setBaseMenu');
          expect(storeState.items[0].name).toBe('Login');
          expect(storeState.optionsMenu).toBeFalsy();
        });
      });

      // Test option menus in second menu
      dispatch(['More', null], MenuActions.BTN_CLICK); // navigate to second menu

      describe('difficulty menu', () => {

        it('sets the difficulty menu', () => {
          dispatch(['Difficulty', 'hard'], MenuActions.BTN_CLICK);
          jest.runAllTimers();

          const storeState = MenuStore.getState();
          expect(storeState.rootMenu.name).toBe('_setSecondMenu');
          expect(storeState.items[0].name).toBe('Difficulty:');
          expect(storeState.items[1].name).toBe('Hard');
          expect(storeState.items[1].active).toBe(true);
        });

        it('sets a new difficulty using chooseOption', () => {
          dispatch('Medium', MenuActions.CHOOSE_OPTION);
          let storeState = MenuStore.getState();
          expect(storeState.items[1].active).toBe(false);
          expect(storeState.items[2].active).toBe(true);

          jest.runAllTimers();

          storeState = MenuStore.getState();
          expect(storeState.items[0].name).toBe('Difficulty');

        });

        describe('audio menu', () => {

          it('sets the audio menu', () => {
            dispatch(['Audio', 'piano'], MenuActions.BTN_CLICK);
            jest.runAllTimers();

            const storeState = MenuStore.getState();
            expect(storeState.rootMenu.name).toBe('_setSecondMenu');
            expect(storeState.items[0].name).toBe('Audio:');
            expect(storeState.items[1].name).toBe('Piano');
            expect(storeState.items[1].active).toBe(true);
          });

          it('sets a new audio option using chooseOption', () => {
            dispatch('None', MenuActions.CHOOSE_OPTION);
            let storeState = MenuStore.getState();
            expect(storeState.items[1].active).toBe(false);
            expect(storeState.items[2].active).toBe(true);

            jest.runAllTimers();

            storeState = MenuStore.getState();
            expect(storeState.items[0].name).toBe('Difficulty');
          });

        });

        describe('input menu', () => {

          it('sets the input menu', () => {
            dispatch(['Input', 'buttons'], MenuActions.BTN_CLICK);
            jest.runAllTimers();

            const storeState = MenuStore.getState();
            expect(storeState.items[0].name).toBe('Input:');
            expect(storeState.items[1].name).toBe('Buttons');
            expect(storeState.items[1].active).toBe(true);
          });

          it('sets a new input option', () => {
            dispatch('Piano', MenuActions.CHOOSE_OPTION);
            let storeState = MenuStore.getState();
            expect(storeState.items[1].active).toBe(false);
            expect(storeState.items[2].active).toBe(true);

            jest.runAllTimers();

            storeState = MenuStore.getState();
            expect(storeState.items[0].name).toBe('Difficulty');
          });

        });

      })

      dispatch(['Back', null], MenuActions.BTN_CLICK); // navigate back from second menu
    });

    describe('toggleOption() menu', () => {
      it('sets the clefs menu', () => {
        dispatch(['Clefs', ['treble', 'bass', 'tenor']], MenuActions.BTN_CLICK);
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.doneBtn).toBe(true);
        expect(storeState.rootMenu.name).toBe('_setBaseMenu');
        expect(storeState.items[0].name).toBe('Clefs:');
        expect(storeState.items[1].active).toBe(true);
        expect(storeState.items[2].active).toBe(true);
        expect(storeState.items[4].active).toBe(true);
        expect(storeState.items[3].active).toBe(false);
      });

      // Treble, bass, and tenor are active

      it('sets the right state after toggling options', () => {
        const action = MenuActions.TOGGLE_OPTION;
        dispatch('Treble', action);
        dispatch('Alto', action);
        dispatch('Bass', action);
        dispatch('Treble', action);
        dispatch('Tenor', action);
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.items[1].active).toBe(true);
        expect(storeState.items[2].active).toBe(false);
        expect(storeState.items[3].active).toBe(true);
        expect(storeState.items[4].active).toBe(false);
      });

      // Treble and Alto are active

      it('doesn\'t allow all options to be toggled off', () => {
        const action = MenuActions.TOGGLE_OPTION;
        dispatch('Treble', action);
        dispatch('Alto', action);

        const storeState = MenuStore.getState();
        expect(storeState.items[1].active).toBe(false);
        expect(storeState.items[3].active).toBe(true);
      });

      it('submits resets after submit', () => {
        dispatch(null, MenuActions.SUBMIT_OPTIONS);
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.optionsMenu).toBeFalsy();
        expect(storeState.items.length).toBe(5);
        expect(storeState.items[0].name).toBe('Login');
      });

    });

  });

});
