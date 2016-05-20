import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {

  constructor() {
    this.bindActions(NoteActions);
    this.note = 'A';
  }

  set(note) {
    this.setState({note});
  }

}

export default alt.createStore(NoteStore, 'NoteStore');
