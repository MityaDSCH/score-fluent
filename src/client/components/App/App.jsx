import React from 'react';
import AltContainer from 'alt-container';

import Display from '../Display/Display.jsx';
import Input from '../Input/Input.jsx';

import DisplayStore from '../../logic/stores/GameStore.js';


export default class App extends React.Component {

  render() {

    return (
      <div id='game-container'>
        <AltContainer
          store={DisplayStore}>

          <Display />
          <Input />

        </AltContainer>

      </div>
    );
  }

}
