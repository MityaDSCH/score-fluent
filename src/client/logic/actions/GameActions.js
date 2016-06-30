import alt from '../libs/alt';

import MenuActions from './MenuActions';

class GameActions {

  constructor() {
    this.generateActions(
      'setNewOption',
      'stopTimed',
      'guessNote'
    );
  }

  startTimed() {
    MenuActions.setTimedMenu();
    return null;
  }

}

export default alt.createActions(GameActions);
