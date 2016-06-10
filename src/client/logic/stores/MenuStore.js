import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';
import AuthActions from '../actions/AuthActions';

import AuthStore from './AuthStore';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.menuItems = [];

    this.modal = false;
    this.fadeModal = false;
    this.modalAnimationDelay = 500;
    this.modalCardClass = '';
    this.modalFormItems = [];
    this.validForm = false;
  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  init(payload) {
    console.log(payload);
    if (payload) this.menuItems = ['Logout', `Hi ${payload.username}!`];
    else this.menuItems = ['Login', 'Register'];
  }

  closeModal() {
    this.setState({
      fadeModal: true
    });
    setTimeout(() => {
      this.setState({
        fadeModal: false,
        modal: false
      });
    }, this.modalAnimationDelay);
  }

  btnClick(btnName) {
    switch (btnName) {
      case 'Register':
        this._setRegisterModal();
        break;
      case 'Login':
        this._setLoginModal();
        break;
      case 'Submit':
        if (this.validForm) {
          if (this.modalCardClass == 'register') {
            const body = {
              username: this.modalFormItems[0].value,
              email: this.modalFormItems[1].value,
              password: this.modalFormItems[2].value
            };
            setTimeout(() => AuthActions.register(body), 0);
          } else if (this.modalCardClass == 'login') {
            const body = {
              id: this.modalFormItems[0].value,
              password: this.modalFormItems[1].value
            };
            setTimeout(() => AuthActions.login(body), 0);
          }
        }
        break;
      case 'Logout':
        this.setState({menuItems: ['Login', 'Register']});
        setTimeout(() => AuthActions.logout(), 0);
        break;
      default:
        console.warn(btnName, 'menu-btn click unhandled');
        break;
    }
  }

  updateFormValidation([placeholder, val]) {
    const fieldIndex = _.findIndex(this.modalFormItems, {placeholder});
    const o = this.modalFormItems[fieldIndex];
    o.error = '';
    o.value = val;
    const regex = o.regex;

    // Validate form value
    if (placeholder.toLowerCase() != 'confirm password') {
      if (val === '' && o.validationState != 'clean') {
        o.validationState = 'clean';
      }
      // if not empty and not already marked dirty, set dirty
      else if (!regex.test(val) && o.validationState != 'dirty') {
        o.validationState = 'dirty';
      }
      else if (regex.test(val) && o.validationState != 'valid') {
        o.validationState = 'valid';
      }
    } else {
      const password = this.modalFormItems[_.findIndex(this.modalFormItems, {placeholder: 'Password'})];
      if (val === '' && o.validationState != 'clean') {
        o.validationState = 'clean';
      } else if (val != password.value) {
        o.validationState = 'dirty';
      } else {
        o.validationState = 'valid';
      }
    }

    // Update this.items
    this.modalFormItems[fieldIndex] = o;
    // Check if form is valid
    this._updateValid();
  }

  registerLoginSuccess(payload) {
    this.closeModal();
    this.menuItems = ['Logout', 'Hi ' + payload.username + '!']
  }

  registerLoginFail(invalidFields) {
    invalidFields.forEach((err) => {
      this.modalFormItems.forEach((item) => {
        if ((item.type == 'input' || item.type == 'password') && item.placeholder.toLowerCase() == err.field.toLowerCase()) {
          item.error = err.message;
          item.validationState = 'dirty';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // ----------------------------------------------------------------------------

  _updateValid() {
    let validForm = true;
    for (var i = 0; i < this.modalFormItems.length; i++) { // Check if all form items are valid -> validForm
      const item = this.modalFormItems[i];
      if (item.type == 'input' || item.type == 'password') {
        if (item.validationState != 'valid') {
          validForm = false;
          break;
        }
      }
    }
    this.setState({validForm});
    if (validForm) { // If valid set submit button valid
      _.each(this.modalFormItems, (ele) => {
        if (ele.type == 'validation-button') ele.validationState = 'valid';
      });
    } else {
      _.each(this.modalFormItems, (ele) => {
        if (ele.type == 'validation-button') ele.validationState = '';
      });
    }
  }

  _setRegisterModal() {
    this.setState({
      modal: true,
      modalCardClass: 'register',
      modalFormItems: [
        {
          type: 'input',
          placeholder: 'Username',
          value: '',
          error: '',
          help: 'Username can include letters and symbols, must be > 2 long',
          regex: /^[A-Za-z\d$@$!%*?&]{3,}/,
          validationState: 'clean'
        },
        {
          type: 'input',
          placeholder: 'Email',
          value: '',
          error: '',
          help: 'Email must be valid',
          regex: /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Password',
          value: '',
          error: '',
          help: 'Password must include upper and lowercase + number; must be > 8 long',
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Confirm password',
          value: '',
          error: '',
          help: 'Must match other password',
          regex: /\S+/,
          validationState: 'clean'
        },
        {
          type: 'validation-button',
          value: 'Submit',
          validationState: 'clean'
        }
      ]
    });
  }

  _setLoginModal() {
    this.setState({
      modal: true,
      modalCardClass: 'login',
      modalFormItems: [
        {
          type: 'input',
          placeholder: 'Username or Email',
          value: '',
          error: '',
          help: 'Must be valid',
          regex: /^[A-Za-z\d$@$!%*?&]{3,}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Password',
          value: '',
          error: '',
          help: 'Password must include upper and lowercase + number; > must be 8 long',
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/,
          validationState: 'clean'
        },
        {
          type: 'validation-button',
          value: 'Submit'
        }
      ]
    });
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
