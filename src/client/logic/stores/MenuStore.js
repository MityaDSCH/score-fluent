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

  updateValidationState(params) {
    const fieldPlaceholder = params[0];
    const newState = params[1];
    const fieldIndex = _.findIndex(this.items, {'placeholder': fieldPlaceholder});
    const items = this.items;
    items[fieldIndex].validationState = newState;
    this.setState({items});
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
          placeholder: 'Username',
          regex: /^[A-Za-z\d$@$!%*?&]{3,}/,
          validationState: 'clean'
        },
        {
          type: 'input',
          placeholder: 'Email',
          regex: /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Password',
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Confirm password',
          regex: /\S+/,
          validationState: 'clean'
        },
        {
          type: 'button',
          text: 'Submit',
          validationState: 'inactive'
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
