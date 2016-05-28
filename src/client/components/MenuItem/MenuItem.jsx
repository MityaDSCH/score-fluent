import React from 'react';

import MenuActions from '../../logic/actions/MenuActions';

export default class MenuItem extends React.Component {

  render() {

    var out = null;

    if (this.props.item.type == 'button') {
      out = <p
              className='menu-item menu-btn'
              onClick={this.btnClick.bind(this)}>
              {this.props.item.text}
            </p>
    } else if (this.props.item.type == 'input' || this.props.item.type == 'password') {
      out = <input
              className={'menu-item menu-input ' + this.props.item.validationState}
              type={this.props.item.type}
              placeholder={this.props.item.placeholder}
              onChange={this.inputChange.bind(this)}
              required='true'>
            </input>
    }

    return out;
  }

  btnClick() {
    MenuActions.btnClick(this.props.item.text);
  }

  inputChange(e) {
    const val = e.target.value;
    const regex = this.props.item.regex;
    console.log(val, regex, regex.test(val));
    if (val === '' && this.props.item.placeholder != 'clean') {
      MenuActions.updateValidationState(this.props.item.placeholder, 'clean');
    }
    // if not empty and not already marked dirty, set dirty
    else if (!regex.test(val) &&
             this.props.item.validationState != 'dirty') {
      MenuActions.updateValidationState(this.props.item.placeholder, 'dirty');
    }
    else if (regex.test(val) &&
             this.props.item.validationState != 'valid') {
      MenuActions.updateValidationState(this.props.item.placeholder, 'valid');
   }
  }

};
