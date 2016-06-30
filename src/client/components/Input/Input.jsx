import React from 'react';

import DisplayActions from '../../logic/actions/GameActions';

export default class App extends React.Component {

  render() {
    this.active = this.props.screen === 'staves';
    const guessStatus = this.props.guessStatus;
    let correct;
    let incorrect;

    if (guessStatus) {
      correct = guessStatus.correct.pitch;
      incorrect = guessStatus.incorrect ? guessStatus.incorrect.pitch : null;
    }

    // Lord forgive me for I have sinned and manipulated a grandparent's state from here
    const background = document.querySelector('#app-background');
    if (background) background.className = (guessStatus ? guessStatus.guess : '');

    return (
      <div id="keyboard">{this.props.inputNotes.map((note) => {
        let status = '';
        if (correct == note) status = ' correct';
        else if (incorrect == note) status = ' incorrect';
        return (
          <button
            key={('keyboard-' + note)}
            className={'keyboard-button' + status + (this.active ? ' active' : '')}
            onClick={this.guessNote.bind(null, note)}>
            {note}
          </button>
        );
      }
      )}</div>
    );
  }

  guessNote = (pitch) => {
    if (this.active) DisplayActions.guessNote({pitch, octave: null});
  };

}
