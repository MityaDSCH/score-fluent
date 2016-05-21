import alt from '../libs/alt';
import DisplayActions from '../actions/DisplayActions';

class DisplayStore {

  constructor() {
    this.bindActions(DisplayActions);
    this.clef = 'treble';
    this.note = 'a';
  }

  setClef(clef) {
    this.setState({clef});
  }

  setNote(note) {
    this.setState({note});
  }

}

export default alt.createStore(DisplayStore, 'DisplayStore');
