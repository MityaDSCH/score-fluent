import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu-container">
        <div id='menu-items'>
          {this.props.menuItems.map((menuItem) =>
            <p
              className='menu-item'
              onClick={this.menuClick.bind(menuItem)}
              key={menuItem}>
                {menuItem}
            </p>
          )}
        </div>
      </div>
    );
  }

  menuClick() {
    MenuActions.btnClick(this);
  }
}
