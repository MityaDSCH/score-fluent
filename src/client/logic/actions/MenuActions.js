import alt from '../libs/alt';

import ModalActions from './ModalActions';
import AuthActions from './AuthActions';

import GameStore from '../stores/GameStore';

class MenuActions {

  constructor() {
    this.generateActions(
      'init',
      'registerLoginSuccess',
      'chooseOption',
      'toggleOption',
      'submitOptions'
    );
  }

  btnClick(btnName) {
    return dispatch => {
      switch (btnName) { // Catch clicks that trigger other actions
        case 'Register':
          ModalActions.register();
          break;
        case 'Login':
          ModalActions.login();
          break;
        case 'Logout':
          dispatch(btnName);
          AuthActions.logout();
          break;
        case 'Mode':
          dispatch([btnName, GameStore.getMode()]);
          break;
        case 'Clefs':
          dispatch([btnName, GameStore.getClefs()]);
          break;
        case 'Difficulty':
          dispatch([btnName, GameStore.getDifficulty()]);
          break;
        default:
          dispatch(btnName);
          break;
      }
    }
  }

}

export default alt.createActions(MenuActions);
