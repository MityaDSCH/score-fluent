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
    } else if (this.props.item.type == 'input') {
      out = <input
              className='menu-item menu-input'
              type='text'
              placeholder={this.props.item.placeholder}
              required='true'>
            </input>
    } else if (this.props.item.type == 'password') {
      out = <input
              className='menu-item menu-input'
              type='password'
              placeholder={this.props.item.placeholder}
              required='true'>
            </input>
    }

    return out;
  }

  btnClick() {
    MenuActions.btnClick(this.props.item.text);
  }

};
