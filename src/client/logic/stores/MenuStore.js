import alt from '../libs/alt';
import _ from 'lodash';

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

  btnClick(btnName) {
    switch (btnName) {
      case 'Register':
        this._registerForm();
        break;
      case 'Login':
        this._loginForm();
        break;
      case 'Stats':

        break;
      case 'Back':
        this._nullForm();
        break;
      default:
        console.log('menu-btn click unhandled');
        break;
    }
  }

  _nullForm() {
    this.setState({
      status: null,
      items: [
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
      ]
    });
  }

  _registerForm() {
    this.setState({
      status: 'register',
      items: [
        {
          type: 'button',
          text: 'Back'
        },
        {
          type: 'input',
          placeholder: 'Username'
        },
        {
          type: 'input',
          placeholder: 'Email'
        },
        {
          type: 'password',
          placeholder: 'Password'
        },
        {
          type: 'password',
          placeholder: 'Confirm password'
        },
        {
          type: 'button',
          text: 'Submit'
        }
      ]
    });
  }

  _loginForm() {
    this.setState({
      status: 'login',
      items: [
        {
          type: 'button',
          text: 'Back'
        },
        {
          type: 'input',
          placeholder: 'Username or Email'
        },
        {
          type: 'password',
          placeholder: 'Password'
        },
        {
          type: 'button',
          text: 'Submit'
        }
      ]
    });
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
