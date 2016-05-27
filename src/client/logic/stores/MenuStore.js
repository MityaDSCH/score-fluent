import alt from '../libs/alt';
import MenuActions from '../actions/MenuActions';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.open = false;
    this.buttons = ['Register', 'Login', 'Stats'];
    this.loggedIn = false;
  }

}

export default alt.createStore(MenuStore, 'MenuStore');
