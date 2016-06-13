import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';
import ModalActions from '../actions/ModalActions';
import AuthActions from '../actions/AuthActions';
import GameActions from '../actions/GameActions';

import AuthStore from './AuthStore';
import GameStore from './GameStore';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.rootItems = [];
    this.items = []; // Items in menu
    this.optionsMenu = false;
    this.originalOptions = [];
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
    if (this.doneBtn) { // If there is a done button (multipe options can be active), toggle the clicked option
      const items = this.items.map(item => {
        return {...item, active: (item.name === option ? !item.active : item.active)};
      });
      this.setState({items});
    } else { // Toggle option and update game state, then after delay animate out options
      const items = this.items.map(item => {
        return {...item, active: item.name === option}
      });
      this.setState({items});
      if (this._optionsChanged()) {
        setTimeout(() => {
          const newOption = {};
          // Find which option changed and create a corresponding object: {changedOption: 'new value'}
          newOption[this.optionsMenu] = this.items.filter(item => item.name === option)[0].name.toLowerCase();
          setTimeout(() => GameActions.setNewOption(newOption), 0);
          this._animateMenu(this.rootItems);
        }, 200);
      } else {
        this._animateMenu(this.rootItems);
      }
    }
  }

  submitOptions() {
    if (this._optionsChanged()) {
      let activeOptions = this.items.filter(item => item.active);
      activeOptions = activeOptions.map(item => item.name.toLowerCase());
      const newSetting = {};
      newSetting[this.optionsMenu] = activeOptions;
      setTimeout(() => GameActions.setNewOption(newSetting), 0);
    }
    this._animateMenu(this.rootItems);
  }

  registerLoginSuccess(payload) {
    this._setLoggedInMenu(payload);
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  _optionsChanged() {
    const newOptions = this.items.filter(item => item.clickable).map(item => item.active);
    return !_.isEqual(newOptions, this.originalOptions);
  }

  // If 2nd param, save cur menu in rootMenu
  // If 3rd param, menu might toggle multiple options, so display done btn
  _animateMenu(items, optionsMenu, doneBtn) {
    this.setState({class: ''});
    setTimeout(() => {
      let originalOptions = items.filter(item => item.clickable).map(item => item.active);
      this.setState({
        class: 'active', // fade in
        items, // w/ these items
        rootItems: optionsMenu ? this.items : [], // saving the original buttons here if the new menu is for options
        optionsMenu, // And recording whether this is an options menu
        originalOptions: optionsMenu ? originalOptions : [], // And recording the original active state of the options
        doneBtn
      });
    }, this.animationDuration);
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
    ]);
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
    ], 'mode');
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
    ], 'clefs', true);
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
        name: 'Medium',
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
    ], 'difficulty');
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
