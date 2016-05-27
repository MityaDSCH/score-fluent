import React from 'react';

import MenuActions from '../../logic/actions/MenuActions';

export default class MenuItem extends React.Component {

  render() {

    var out = null;
    if (this.props.item.type == 'button') {
      out = <p className='menu-item menu-btn'>{this.props.item.text}</p>
    }

    return out;
  }

};
