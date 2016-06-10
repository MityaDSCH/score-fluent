import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu-container" className={this.props.class}>
        {this.props.items.map((item) =>
          <p
            className='menu-item'
            onClick={() => MenuActions.btnClick(item)}
            key={item}>
              {item}
          </p>
        )}
      </div>
    );
  }
}
