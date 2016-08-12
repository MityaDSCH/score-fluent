import React from 'react';

import MenuActions from '../../logic/actions/MenuActions';
import GameActions from '../../logic/actions/GameActions';

export default class App extends React.Component {

  render() {
    return (
      <div id="menu">

        <div id="menu-container" className={this.props.class}>
          {this.props.items.map((item) =>
            <p
              className={'menu-item' + (item.clickable ? ' clickable' : '') + (item.active ? ' active' : '')}
              onClick={this.handleClick.bind(this, item)}
              key={item.name}>
                {item.name}
            </p>
          )}
        </div>

        <div
          id="options-done"
          className={'menu-item clickable' + (this.props.doneBtn ? ' show' : '')}
          onClick={this.submitToggled.bind(this)}>
          Done
        </div>

      </div>
    );
  }

  handleClick(item) {
    if (item.clickable) {
      if (item.option) {
        if (this.props.doneBtn) {
          MenuActions.toggleOption(item.name);
        } else {
          MenuActions.chooseOption(item.name);
          GameActions.setNewOption(this.props.optionsMenu.toLowerCase(), item.name.toLowerCase());
        }
      } else {
        MenuActions.btnClick(item.name);
      }
    }
  }

  submitToggled() {
    const activeItems = this.props.items.filter(item => item.active).map(item => item.name.toLowerCase());
    MenuActions.submitOptions(activeItems);
    GameActions.setNewOption(this.props.optionsMenu.toLowerCase(), activeItems);
  }

}
