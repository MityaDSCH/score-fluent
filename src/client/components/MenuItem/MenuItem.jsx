import React from 'react';

import MenuActions from '../../logic/actions/MenuActions';

export default class MenuItem extends React.Component {

  constructor() {
    super();
    this.state = {
      hasFocus: false
    };
  }

  render() {

    const item = this.props.item;
    let out = null;

    if (item.type == 'button') {
      out = <p
              className='form-item menu-btn'
              onClick={this.btnClick.bind(this)}>
              {item.value}
            </p>
    } else if (item.type == 'input' || item.type == 'password') {
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
              onClick={this.btnClick.bind(this)}>
              {item.value}
            </p>
    }

    return out;
  }

  btnClick() {
    MenuActions.btnClick(this.props.item.value);
  }

  inputChange(e) {
    MenuActions.updateFormValidation(this.props.item.placeholder, e.target.value);
  }

  focus() {
    this.setState({hasFocus: true});
  }

  blur() {
    this.setState({hasFocus: false});
  }
};
