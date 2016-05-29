import React from 'react';

import MenuActions from '../../logic/actions/MenuActions';

export default class MenuItem extends React.Component {

  render() {

    const item = this.props.item;
    let out = null;

    if (item.type == 'button') {
      out = <p
              className='menu-item menu-btn'
              onClick={this.btnClick.bind(this)}>
              {item.value}
            </p>
    } else if (item.type == 'input' || item.type == 'password') {
      out = <input
              className={'menu-item menu-input ' + item.validationState}
              type={item.type}
              placeholder={item.placeholder}
              value={item.value}
              onChange={this.inputChange.bind(this)}
              required='true'>
            </input>
    } else if (item.type == 'validation-button') {
      out = <p
              className={'menu-item validation-button ' + this.props.item.validationState}
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
    MenuActions.updateValidation(this.props.item.placeholder, e.target.value);
  }

};
