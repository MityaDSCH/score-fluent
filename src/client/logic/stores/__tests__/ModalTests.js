jest.unmock('../ModalStore');

import alt from '../../libs/alt';

import ModalActions from '../../actions/ModalActions';
import ModalStore from '../ModalStore';

describe('ModalStore API', () => {

  it('starts with the correct state', () => {
    const storeState = ModalStore.getState();
  });

});
