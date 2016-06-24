import alt from '../libs/alt';
import _ from 'lodash';

import ModalActions from '../actions/ModalActions';

class ModalStore {

  constructor() {
    this.bindActions(ModalActions);

    this.active = false;
    this.fade = false;
    this.animationDelay = 700;
    this.cardClass = '';
    this.formItems = [];
    this.valid = false;
    this.authBody = {};

    this.exportPublicMethods({
      getAuthBody: () => this.authBody
    });

  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  close() {
    this.setState({fade: true});
    setTimeout(() => {
      this.setState({
        fade: false,
        active: false
      });
    }, this.animationDelay);
  }

  register() {
    this.setState({
      active: true,
      cardClass: 'register',
      formItems: [
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

  login() {
    this.setState({
      active: true,
      cardClass: 'login',
      formItems: [
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

  updateFormValidation([placeholder, val]) {
    const fieldIndex = _.findIndex(this.formItems, {placeholder});
    let o = this.formItems[fieldIndex];
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
    }
    if ((placeholder == 'Password' || placeholder == 'Confirm password') && this.cardClass === 'register') {
      this._validatePasswordConfirm();
    }

    // Update this.items
    this.formItems[fieldIndex] = o;
    // Check if form is valid
    this._updateValid();
  }

  registerLoginFail(invalidFields) {
    invalidFields.forEach((err) => {
      this.formItems.forEach((item) => {
        if ((item.type == 'input' || item.type == 'password') && item.placeholder.toLowerCase() == err.field.toLowerCase()) {
          item.error = err.message;
          item.validationState = 'dirty';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  _validatePasswordConfirm() {
    const password = this.formItems[_.findIndex(this.formItems, {placeholder: 'Password'})].value;
    const confInd = _.findIndex(this.formItems, {placeholder: 'Confirm password'});
    const conf = this.formItems[confInd];
    let state;
    if (conf.value === '') {
      if (conf.validationState != 'clean') state = 'clean';
    } else if (conf.value != password) {
      state = 'dirty';
    } else {
      state = 'valid';
    }
    this.formItems[confInd].validationState = state;
    this._updateValid();
  }

  _updateValid() {
    let valid = true;
    for (var i = 0; i < this.formItems.length; i++) { // Check if all form items are valid -> validForm
      const item = this.formItems[i];
      if (item.type == 'input' || item.type == 'password') {
        if (item.validationState != 'valid') {
          valid = false;
          break;
        }
      }
    }
    let authBody = {};
    if (valid) { // If valid set submit button valid
      _.each(this.formItems, (ele) => {
        if (ele.type == 'validation-button') ele.validationState = 'valid';
      });
      if (this.cardClass == 'register') {
        authBody = {
          username: this.formItems[0].value,
          email: this.formItems[1].value,
          password: this.formItems[2].value
        };
      } else if (this.cardClass == 'login') {
        authBody = {
          id: this.formItems[0].value,
          password: this.formItems[1].value
        };
      }
    } else {
      _.each(this.formItems, (ele) => {
        if (ele.type == 'validation-button') ele.validationState = '';
      });
    }
    this.setState({valid, authBody});
  }
}

export default alt.createStore(ModalStore, 'ModalStore');
