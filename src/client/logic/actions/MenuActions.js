import alt from '../libs/alt';

import ModalActions from './ModalActions';
import AuthActions from './AuthActions';

class MenuActions {

  constructor() {
    this.generateActions(
      'init',
      'registerLoginSuccess',
      'toggleOption',
      'submitOptions'
    )
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
        default:
          dispatch(btnName);
          break;
      }
    }
  }
}

export default alt.createActions(MenuActions);
