import React from 'react';
import AltContainer from 'alt-container';

import Display from '../Display/Display.jsx';
import Input from '../Input/Input.jsx';

import NoteStore from '../../alt/stores/NoteStore.js';


export default class App extends React.Component {

  render() {

    console.log('store state:', NoteStore.getState());

    return (
      <div>
        <AltContainer
          store={NoteStore}>

          <Display />
          <Input />

        </AltContainer>

      </div>
    );
  }

}
