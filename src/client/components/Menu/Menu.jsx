import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';

import DownArrow from 'babel!svg-react!../../assets/downArrow.svg';
import MenuItem from '../MenuItem/MenuItem.jsx';

export default class App extends React.Component {

  render() {
    const status = this.props.status ? this.props.status + ' ' : '';
    return (
      <div id="menu-container">
        <div
          id="menu-card"
          className={status + (this.props.open ? 'active' : '')}>

          {this.props.items.map(item =>
            <MenuItem item={item} valid={this.props.valid} />
          )}

        </div>
        <div
          id="pulldown"
          className={"menu-item " + status + (this.props.open ? '' : ' active')}
          onClick={this.clickPulldown}>
          <p className="menu-item">Menu</p>
          <DownArrow id="menu-pulldown-arrow" className="menu-item" />
        </div>
      </div>
    );
  }

  clickPulldown() {
    MenuActions.open();
  }

}
