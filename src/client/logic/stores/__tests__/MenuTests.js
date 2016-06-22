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

describe('MenuStore API', () => {

  describe('init()', () => {
    it('inits properly when passed a JWT payload', () => {
      alt.dispatcher.dispatch({data: examplePayload, action: MenuActions.INIT});
      jest.runAllTimers(); // Sets menu after 200ms delay

      const storeState = MenuStore.getState();
      expect(storeState.items.length).toBe(5);
      expect(storeState.items[0].name).toBe('Hi ' + examplePayload.username + '!');
      expect(storeState.items[4].name).toBe('Logout');
    });

    it('inits properly when not passed a JWT payload', () => {
      alt.dispatcher.dispatch({data: null, action: MenuActions.INIT});
      jest.runAllTimers();

      const storeState = MenuStore.getState();
      expect(storeState.items.length).toBe(5);
      expect(storeState.items[0].name).toBe('Login');
      expect(storeState.items[1].name).toBe('Register');
    });
  });

  describe('option menus', () => {

    describe('chooseOption menus', () => {

      it('sets the mode menu', () => {
        alt.dispatcher.dispatch({
          data: ['Mode', 'timed'],
          action: MenuActions.BTN_CLICK
        });
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.optionsMenu).toBeTruthy();
        expect(storeState.rootItems.length).toBe(5);
        expect(storeState.rootItems[0].name).toBe('Login');
        expect(storeState.items[0].name).toBe('Mode:');
        expect(storeState.items[1].active).toBe(false);
        expect(storeState.items[2].active).toBe(true);
      });

      it('sets a new mode using chooseOption', () => {
        alt.dispatcher.dispatch({
          data: 'Practice',
          action: MenuActions.CHOOSE_OPTION
        });

        let storeState = MenuStore.getState();
        expect(storeState.items[1].active).toBe(true);
        expect(storeState.items[2].active).toBe(false);

        jest.runAllTimers();

        storeState = MenuStore.getState();
        expect(storeState.rootItems.length).toBe(0);
        expect(storeState.items[0].name).toBe('Login');
        expect(storeState.optionsMenu).toBeFalsy();
      });

      it('sets the difficulty menu', () => {

      });

      it('sets a new difficulty using chooseOption()', () => {

      });

    });

    describe('toggleOption() menu', () => {
      it('sets the clefs menu', () => {
        alt.dispatcher.dispatch({
          data: ['Clefs', ['treble', 'bass', 'tenor']],
          action: MenuActions.BTN_CLICK
        });
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.doneBtn).toBe(true);
        expect(storeState.rootItems.length).toBe(5);
        expect(storeState.rootItems[1].name).toBe('Register');
        expect(storeState.items[0].name).toBe('Clefs:');
        expect(storeState.items[1].active).toBe(true);
        expect(storeState.items[2].active).toBe(true);
        expect(storeState.items[4].active).toBe(true);
        expect(storeState.items[3].active).toBe(false);
      });

      // Treble, bass, and tenor are active

      it('sets the right state after toggling options', () => {
        const action = MenuActions.TOGGLE_OPTION;
        alt.dispatcher.dispatch({
          data: 'Treble',
          action
        });
        alt.dispatcher.dispatch({
          data: 'Alto',
          action
        });
        alt.dispatcher.dispatch({
          data: 'Bass',
          action
        });
        alt.dispatcher.dispatch({
          data: 'Treble',
          action
        });
        alt.dispatcher.dispatch({
          data: 'Tenor',
          action
        });
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
        alt.dispatcher.dispatch({
          data: 'Treble',
          action
        });
        alt.dispatcher.dispatch({
          data: 'Alto',
          action
        });

        const storeState = MenuStore.getState();
        expect(storeState.items[1].active).toBe(false);
        expect(storeState.items[3].active).toBe(true);
      });

      it('submits resets after submit', () => {
        alt.dispatcher.dispatch({
          data: null,
          action: MenuActions.SUBMIT_OPTIONS
        });
        jest.runAllTimers();

        const storeState = MenuStore.getState();
        expect(storeState.optionsMenu).toBeFalsy();
        expect(storeState.items.length).toBe(5);
        expect(storeState.items[0].name).toBe('Login');
      });

    });

  });

});
