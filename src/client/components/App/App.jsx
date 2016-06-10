import React from 'react';
import AltContainer from 'alt-container';

import AuthStore from '../../logic/stores/AuthStore';
import MenuStore from '../../logic/stores/MenuStore';
import GameStore from '../../logic/stores/GameStore';
import ModalStore from '../../logic/stores/ModalStore';

import MenuActions from '../../logic/actions/MenuActions';

import Menu from '../Menu/Menu.jsx';
import Modal from '../Modal/Modal.jsx';
import Display from '../Display/Display.jsx';
import Input from '../Input/Input.jsx';

export default class App extends React.Component {

  render() {

    return (
      <div id="app-background">
        <div id="app-card">
          <AltContainer
            store={GameStore}>
            <Display />
            <Input />
          </AltContainer>
          <AltContainer
            store={MenuStore}>
            <Menu />
          </AltContainer>
          <AltContainer
            store={ModalStore}>
            <Modal />
          </AltContainer>
        </div>
      </div>
    );
  }
}
