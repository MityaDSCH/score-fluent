import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';

export class UnwrappedMenuStore {

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

  registerLoginSuccess(payload) {
    this._setLoggedInMenu(payload);
  }

  btnClick([btnName, curSetting]) {
    switch (btnName) {
      case 'Logout':
        this._setLoggedOutMenu();
        break;
      case 'Mode':
        this._setModeMenu(curSetting);
        break;
      case 'Clefs':
        this._setClefsMenu(curSetting);
        break;
      case 'Difficulty':
        this._setDifficultyMenu(curSetting);
        break;
      default:
        console.warn(btnName, 'menu-btn click unhandled');
        break;
    }
  }

  chooseOption(option) {
    const curOption = this.items.filter(item => item.active).name;
    if (option !== curOption) {
      const items = this.items.map(item => {
        return {...item, active: item.name === option}
      });
      this.setState({items});
      setTimeout(() => {
        this._animateMenu(this.rootItems);
      }, 200)
    } else {
      this._animateMenu(this.rootItems);
    }
  }

  toggleOption(option) {
    const activeItems = this.items.filter(item => item.active);
    if (activeItems.length > 1 || option !== activeItems[0].name) {
      const items = this.items.map(item => {
        return {...item, active: (item.name === option ? !item.active : item.active)};
      });
      this.setState({items});
    }
  }

  submitOptions() {
    this._animateMenu(this.rootItems);
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

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

  _setModeMenu(setting) {
    this._animateMenu([
      {name: 'Mode:', clickable: false},
      {
        name: 'Practice',
        clickable: true,
        option: true,
        active: setting === 'practice'
      },
      {
        name: 'Timed',
        clickable: true,
        option: true,
        active: setting === 'timed'
      }
    ], 'mode');
  }

  _setClefsMenu(setting) { // List of VexFlow clefs: https://github.com/0xfe/vexflow/blob/master/tests/clef_tests.js
    this._animateMenu([
      {name: 'Clefs:', clickable: false},
      {
        name: 'Treble',
        clickable: true,
        option: true,
        active: _.includes(setting, 'treble')
      },
      {
        name: 'Bass',
        clickable: true,
        option: true,
        active: _.includes(setting, 'bass')
      },
      {
        name: 'Alto',
        clickable: true,
        option: true,
        active: _.includes(setting, 'alto')
      },
      {
        name: 'Tenor',
        clickable: true,
        option: true,
        active: _.includes(setting, 'tenor')
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

  _setDifficultyMenu(setting) {
    this._animateMenu([
      {name: 'Difficulty:', clickable: false},
      {
        name: 'Hard',
        clickable: true,
        option: true,
        active: setting === 'hard'
      },
      {
        name: 'Medium',
        clickable: true,
        option: true,
        active: setting === 'medium'
      },
      {
        name: 'Easy',
        clickable: true,
        option: true,
        active: setting === 'easy'
      }
    ], 'difficulty');
  }
}

export default alt.createStore(UnwrappedMenuStore, 'MenuStore');
