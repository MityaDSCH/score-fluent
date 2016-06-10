import React from 'react';

import ModalActions from '../../logic/actions/ModalActions';

export default class ModalFormItem extends React.Component {

  constructor() {
    super();
    this.state = {
      hasFocus: false
    };
  }

  render() {

    const item = this.props.item;
    let out = null;

    if (item.type == 'input' || item.type == 'password') {
      let helpText = null;
      if (item.error) helpText = item.error;
      else if (this.state.hasFocus && item.validationState != 'valid') helpText = item.help;
      out = <div className='input-container'>
              <input
                className={'form-item menu-input ' + item.validationState}
                type={item.type}
                placeholder={item.placeholder}
                value={item.value}
                onChange={this.inputChange.bind(this)}
                onFocus={this.focus.bind(this)}
                onBlur={this.blur.bind(this)}
                required='true'>
              </input>
              {helpText ? <p className="help">{helpText}</p> : null}
            </div>
    } else if (item.type == 'validation-button') {
      out = <p
              className={'form-item validation-button ' + this.props.item.validationState}
              onClick={this.submit.bind(this)}>
              {item.value}
            </p>
    }

    return out;
  }

  submit() {
    ModalActions.submit();
  }

  inputChange(e) {
    ModalActions.updateFormValidation(this.props.item.placeholder, e.target.value);
  }

  focus() {
    this.setState({hasFocus: true});
  }

  blur() {
    this.setState({hasFocus: false});
  }
};
