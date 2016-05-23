import React from 'react';

import DisplayActions from '../../logic/actions/GameActions';

export default class App extends React.Component {

  render() {

    const notes = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

    return (
      <div id="keyboard">{notes.map(note =>
        <button
          key={('keyboard-' + note)}
          className={'keyboard-button'}
          onClick={this.guessNote.bind(null, note)}>
          {note}
        </button>
      )}</div>
    );
  }

  guessNote = (pitch) => {
    DisplayActions.guessNote({pitch, octave: null});
  };

}
