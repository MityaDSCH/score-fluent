import alt from '../libs/alt';
import MenuActions from '../actions/MenuActions';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.open = false;
    this.status = null;

    this.items = [
      {
        type: 'button',
        text: 'Register'
      },
      {
        type: 'button',
        text: 'Login'
      },
      {
        type: 'button',
        text: 'Stats'
      }
    ];
  }

  open() {
    if (!this.open) this.setState({open: true});
  }

  close() {
    if (this.open) this.setState({open: false});
  }

}

export default alt.createStore(MenuStore, 'MenuStore');
