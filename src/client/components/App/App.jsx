import React from 'react';
import AltContainer from 'alt-container';

import Note from '../Note/Note.jsx';
import Keyboard from '../Keyboard/Keyboard.jsx';

import NoteStore from '../../alt/stores/NoteStore.js';


export default class App extends React.Component {

  render() {
    return (
      <div>
        <AltContainer
          stores={[NoteStore]}
          inject={{note: NoteStore.getState().note}}>

          <Note />
          <Keyboard />

        </AltContainer>

      </div>
    );
  }

}
