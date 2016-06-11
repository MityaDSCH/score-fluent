import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu-container" className={this.props.class}>
        {this.props.items.map((item) =>
          <p
            className={'menu-item' + (item.clickable ? ' active' : '')}
            onClick={() => {if (item.clickable) MenuActions.btnClick(item.name)}}
            key={item.name}>
              {item.name}
          </p>
        )}
      </div>
    );
  }
}
