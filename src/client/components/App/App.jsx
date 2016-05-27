import React from 'react';
import AltContainer from 'alt-container';

import MenuStore from '../../logic/stores/MenuStore';
import GameStore from '../../logic/stores/GameStore';

import Menu from '../Menu/Menu.jsx';
import Display from '../Display/Display.jsx';
import Input from '../Input/Input.jsx';

export default class App extends React.Component {

  render() {

    return (
      <div id="app-root">
        <div id="menu-container">
          <AltContainer
            store={MenuStore}>
            <Menu />
          </AltContainer>
        </div>
        <div id='game-container'>
          <AltContainer
            store={GameStore}>
            <Display />
            <Input />
          </AltContainer>
        </div>
      </div>
    );
  }

}
