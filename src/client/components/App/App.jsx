import React from 'react';
import AltContainer from 'alt-container';

import AuthStore from '../../logic/stores/AuthStore';
import MenuStore from '../../logic/stores/MenuStore';
import GameStore from '../../logic/stores/GameStore';

import MenuActions from '../../logic/actions/MenuActions';

import Greeting from '../Greeting/Greeting.jsx';
import Menu from '../Menu/Menu.jsx';
import Display from '../Display/Display.jsx';
import Input from '../Input/Input.jsx';

export default class App extends React.Component {

  render() {

    return (
      <div id="app-background"
        onClick={this.closeMenu}>
        <div id="app-card">
          <AltContainer
            store={AuthStore}>
            <Greeting />
          </AltContainer>
          <AltContainer
            store={MenuStore}>
            <Menu />
          </AltContainer>
          <AltContainer
            store={GameStore}>
            <Display />
            <Input />
          </AltContainer>
        </div>
      </div>
    );
  }

  closeMenu(e) {
    if (e.target.id != 'menu-card' && !e.target.classList.contains('menu-item')) {
      MenuActions.close();
    }
  }

}
