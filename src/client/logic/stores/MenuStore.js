import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';

export class UnwrappedMenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.payload = null;
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
    if (payload) this.setState({payload});
    else this.setState({payload: null});
    this._setBaseMenu();
  }

  registerLoginSuccess(payload) {
    this.setState({payload});
    this._setBaseMenu();
  }

  btnClick([btnName, curSetting]) {
    switch (btnName) {
      case 'Logout':
        this.setState({payload: null});
        this._setBaseMenu();
        break;
      case 'Mode':
        this._setModeMenu(curSetting);
        break;
      case 'Clefs':
        this._setClefsMenu(curSetting);
        break;
      case 'More':
        this._setSecondMenu();
        break;
      case 'Back':
        this._setBaseMenu();
        break;
      case 'Difficulty':
        this._setDifficultyMenu(curSetting);
        break;
      case 'Stop':
        this._animateMenu(this.rootItems);
        break;
      default:
        console.warn(btnName, 'menu-btn click unhandled');
        break;
    }
  }

  chooseOption(option) {
    const curOption = this.items.filter(item => item.active).name;
    if (option !== curOption) {

      // Set new option as active
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

  setTimedMenu() {
    this._setTimedMenu();
  }

  removeTimedMenu() {
    this._animateMenu(this.rootItems);
  }

  updateScore(score) {
    if (this.optionsMenu === 'timed') {
      let ind;
      this.items.forEach((item, i) => {
        if (item.name.indexOf('Score:') != -1) ind = i;
      });
      const items = this.items;
      items[ind].name = 'Score: ' + score;
      this.setState({items});
    }
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  // If 2nd param truthy, save cur menu in rootMenu
  // If 3rd param true, menu might toggle multiple options, so display done btn
  _animateMenu(items, optionsMenu, doneBtn) {
    this.setState({class: ''}); // fade out
    setTimeout(() => {
      let originalOptions = items.filter(item => item.clickable).map(item => item.active);
      this.setState({
        class: 'active', // fade in
        items,
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

  _setBaseMenu() {
    let authButtons;
    if (this.payload) {
      authButtons = [
        {name: `Hi ${this.payload.username}!`, clickable: false},
        {name: 'Logout', clickable: true}
      ]
    } else {
      authButtons = [
        {name: 'Login', clickable: true},
        {name: 'Register', clickable: true}
      ]
    }

    this._animateMenu([
      ...authButtons,
      {name: 'Mode', clickable: true},
      {name: 'Clefs', clickable: true},
      {name: 'More', clickable: true}
    ])
  }

  _setSecondMenu() {
    this._animateMenu([
      {name: 'Difficulty', clickable: true},
      {name: 'Input', clickable: true},
      {name: 'Mute', clickable: true},
      {name: 'Back', clickable: true}
    ])
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

  _setTimedMenu() {
    this._animateMenu([
      {name: 'Stop', clickable: true},
      {name: 'Score: 0', clickable: false}
    ], 'timed');
  }
}

export default alt.createStore(UnwrappedMenuStore, 'MenuStore');
