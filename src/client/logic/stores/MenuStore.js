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
      case 'Mode':
        this._setModeMenu();
        break;
      case 'Clefs':
        this._setClefsMenu();
        break;
      case 'Difficulty':
        this._setDifficultyMenu();
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
      {name: 'Login', clickable: true},
      {name: 'Register', clickable: true},
      {name: 'Mode', clickable: true},
      {name: 'Clefs', clickable: true},
      {name: 'Difficulty', clickable: true}
    ]);
  }

  _setLoggedInMenu(payload) {
    this._animateMenu([
      {name: `Hi ${payload.username}!`, clickable: false},
      {name: 'Mode', clickable: true},
      {name: 'Clefs', clickable: true},
      {name: 'Difficulty', clickable: true},
      {name: 'Logout', clickable: true}
    ]);
  }

  _setModeMenu() {
    this._animateMenu([
      {name: 'Mode:', clickable: false},
      {name: 'Practice', clickable: true},
      {name: 'Timed', clickable: true}
    ]);
  }

  _setClefsMenu() { // List of VexFlow clefs: https://github.com/0xfe/vexflow/blob/master/tests/clef_tests.js
    this._animateMenu([
      {name: 'Treble', clickable: true},
      {name: 'Bass', clickable: true},
      {name: 'Alto', clickable: true},
      {name: 'Tenor', clickable: true},
      {name: 'More', clickable: true}
    ]);
  }

  _setMoreClefsMenu() {
    this._animateMenu([
      {name: 'Back', clickable: true},
      {name: 'Soprano', clickable: true},
      {name: 'Mezzo-Soprano', clickable: true},
      {name: 'Baritone-F', clickable: true},
      {name: 'Baritone-C', clickable: true},
      {name: 'Subbass', clickable: true}
    ]);
  }

  _setDifficultyMenu() {
    this._animateMenu([
      {name: 'Difficulty:', clickable: false},
      {name: 'Hard', clickable: true},
      {name: 'Medum', clickable: true},
      {name: 'Easy', clickable: true}
    ]);
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
