import alt from '../libs/alt';


class GameActions {

  constructor() {
    this.generateActions(
      'setNewOption',
      'startTimed',
      'stopTimed',
      'logScore',
      'guessNote',
      'setNote'
    );
  }

}

export default alt.createActions(GameActions);
