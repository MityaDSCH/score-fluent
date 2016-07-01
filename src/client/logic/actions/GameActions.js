import alt from '../libs/alt';


class GameActions {

  constructor() {
    this.generateActions(
      'setNewOption',
      'startTimed',
      'stopTimed',
      'guessNote'
    );
  }

}

export default alt.createActions(GameActions);
