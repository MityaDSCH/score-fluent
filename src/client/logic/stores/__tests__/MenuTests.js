jest.unmock('../MenuStore.js');

import MenuStore, {UnwrappedMenuStore} from '../MenuStore';

describe('MenuStore', () => {
  it('inits properly when passed a JWT payload', () => {
    console.log(MenuStore.getState());
  })

  it('inits properly when not passed a JWT payload', () => {
    console.log(UnwrappedMenuStore);
  });
});
