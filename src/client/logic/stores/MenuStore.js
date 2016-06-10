import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';
import ModalActions from '../actions/ModalActions';
import AuthActions from '../actions/AuthActions';

import AuthStore from './AuthStore';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.items = [];
    this.class = 'active';
    this.animationDuration = 600;

  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  init(payload) {
    if (payload) this._setLoggedInMenu(payload);
    else this._setLoggedOutMenu();
  }

  closeModal() {
    setTimeout(ModalActions.close(), 0);
  }

  btnClick(btnName) {
    switch (btnName) {
      case 'Register':
        setTimeout(() => ModalActions.register(), 0);
        break;
      case 'Login':
        setTimeout(() => ModalActions.login(), 0);
        break;
      case 'Logout':
        this._setLoggedOutMenu();
        setTimeout(() => AuthActions.logout(), 0);
        break;
      default:
        console.warn(btnName, 'menu-btn click unhandled');
        break;
    }
  }

  registerLoginSuccess(payload) {
    this._setLoggedInMenu(payload);
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  _animateMenu(items) {
    this.setState({class: ''});
    setTimeout(() => this.setState({
      class: 'active',
      items
    }), this.animationDuration);
  }

  _setLoggedOutMenu() {
    this._animateMenu([
      'Login',
      'Register',
      'Mode',
      'Clefs',
      'Difficulty'
    ]);
  }

  _setLoggedInMenu(payload) {
    this._animateMenu([
      `Hi ${payload.username}!`,
      'Mode',
      'Clefs',
      'Difficulty',
      'Logout'
    ]);
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
