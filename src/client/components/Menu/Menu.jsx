import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';
import DownArrow from 'babel!svg-react!../../assets/downArrow.svg';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu-container">
        <div
          id="menu-card"
          className={this.props.open ? 'active' : ''}>

          {this.props.buttons.map(name =>
            <p
              key={'menu-btn-' + name}
              className='menu-item'
              >{name}</p>
          )}

        </div>
        <div
          id="pulldown"
          className="menu-item"
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
