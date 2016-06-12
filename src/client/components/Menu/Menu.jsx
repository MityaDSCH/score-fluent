import React from 'react';
import MenuActions from '../../logic/actions/MenuActions';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu-container" className={this.props.class}>
        {this.props.items.map((item) =>
          <p
            className={'menu-item' + (item.clickable ? ' clickable' : '') + (item.active ? ' active' : '')}
            onClick={this.handleClick.bind(item)}
            key={item.name}>
              {item.name}
          </p>
        )}
        <div
          id="options-done"
          className={'menu-item clickable' + (this.props.doneBtn ? ' show' : '')}
          onClick={() => MenuActions.submitOptions()}>
          Done
        </div>

      </div>
    );
  }

  handleClick() {
    if (this.clickable) {
      if (this.option) {
        MenuActions.toggleOption(this.name);
      } else {
        MenuActions.btnClick(this.name);
      }
    }
  }
}
