import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';
import ModalActions from '../actions/ModalActions';
import AuthActions from '../actions/AuthActions';

import AuthStore from './AuthStore';
import GameStore from './GameStore';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.rootItems = [];
    this.items = []; // Items in menu
    this.optionsMenu = false;
    this.doneBtn = false;

    this.class = 'active'; // Transition menu down into card
    this.animationDuration = 600;
  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  init(payload) {
    if (payload) this._setLoggedInMenu(payload);
    else this._setLoggedOutMenu();
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

  toggleOption(option) {
    console.log(option);
    if (this.doneBtn) { // If there is a done button (multipe options can be active), toggle the clicked option
      const items = this.items.map((item) => {
        return {...item, active: (item.name === option ? !item.active : item.active)}
      });
      this.setState({items});
    } else { // Toggle option and update game state, then after delay animate out options
      const items = this.items.map((item) => {
        return {...item, active: item.name === option}
      });
      this.setState({items});
      setTimeout(() => this._animateMenu(this.rootItems), 600);
    }
  }

  submitOptions() {
    let activeOptions = this.items.filter((item) => item.active);
    activeOptions = activeOptions.map((item) => item.name.toLowerCase());
    console.log(activeOptions);
    this._animateMenu(this.rootItems);
  }

  registerLoginSuccess(payload) {
    this._setLoggedInMenu(payload);
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  // If 2nd param, save cur menu in rootMenu
  // If 3rd param, menu might toggle multiple options, so display done btn
  _animateMenu(items, optionsMenu, doneBtn) {
    this.setState({class: ''});
    setTimeout(() => this.setState({
      class: 'active',
      items,
      rootItems: optionsMenu ? this.items : [],
      doneBtn
    }), this.animationDuration);
  }

  // --------------------------------------------------------------------------
  // Menu objects:
  //  name is displayed in menu bar
  //  clickable is disabled for labels like "Difficulty: " or "Clefs: "
  //  option implies toggleable
  //  active implies toggle state

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
    ], true);
  }

  _setModeMenu() {
    const mode = GameStore.getMode();
    this._animateMenu([
      {name: 'Mode:', clickable: false},
      {
        name: 'Practice',
        clickable: true,
        option: true,
        active: mode === 'practice'
      },
      {
        name: 'Timed',
        clickable: true,
        option: true,
        active: mode === 'timed'
      }
    ], true);
  }

  _setClefsMenu() { // List of VexFlow clefs: https://github.com/0xfe/vexflow/blob/master/tests/clef_tests.js
    const clefs = GameStore.getClefs();
    this._animateMenu([
      {name: 'Clefs:', clickable: false},
      {
        name: 'Treble',
        clickable: true,
        option: true,
        active: _.includes(clefs, 'treble')
      },
      {
        name: 'Bass',
        clickable: true,
        option: true,
        active: _.includes(clefs, 'bass')
      },
      {
        name: 'Alto',
        clickable: true,
        option: true,
        active: _.includes(clefs, 'alto')
      },
      {
        name: 'Tenor',
        clickable: true,
        option: true,
        active: _.includes(clefs, 'tenor')
      }
    ], true, true);
  }

  // _setMoreClefsMenu() {
  //   this._animateMenu([
  //     {name: 'Back', clickable: true},
  //     {name: 'Soprano', clickable: true, option: true},
  //     {name: 'Mezzo-Soprano', clickable: true, option: true},
  //     {name: 'Baritone-F', clickable: true, option: true},
  //     {name: 'Baritone-C', clickable: true, option: true},
  //     {name: 'Subbass', clickable: true, option: true}
  //   ]);
  // }

  _setDifficultyMenu() {
    const difficulty = GameStore.getDifficulty();
    this._animateMenu([
      {name: 'Difficulty:', clickable: false},
      {
        name: 'Hard',
        clickable: true,
        option: true,
        active: difficulty === 'hard'
      },
      {
        name: 'Medum',
        clickable: true,
        option: true,
        active: difficulty === 'medium'
      },
      {
        name: 'Easy',
        clickable: true,
        option: true,
        active: difficulty === 'easy'
      }
    ], true);
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
