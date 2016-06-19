jest.unmock('../MenuStore');

jest.mock('../../actions/MenuActions');

import alt from '../../libs/alt';

import MenuActions from '../../actions/MenuActions';
import MenuStore, {UnwrappedMenuStore} from '../MenuStore';

describe('MenuStore', () => {

  describe('init()', () => {
    it('inits properly when passed a JWT payload', () => {
      // alt.dispatcher = { register: jest.genMockFunction() };
      const data = {
        "_id": "575e2254ff8804df7664323e",
        "username": "asdf",
        "email": "asdf@asdf.com",
        "role": "User",
        "iat": 1466295774,
        "exp": 1497853374
      };
      const action = MenuActions.INIT;
      alt.dispatcher.dispatch({data, action});

      jest.runAllTimers(); // Sets menu after 200ms delay
      const storeState = MenuStore.getState();
      expect(storeState.items.length).toBe(5);
      expect(storeState.items[0].name).toBe('Hi ' + data.username + '!');
      expect(storeState.items[4].name).toBe('Logout');
    });
  })

});
