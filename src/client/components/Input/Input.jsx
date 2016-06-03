import React from 'react';

import DisplayActions from '../../logic/actions/GameActions';

export default class App extends React.Component {

  render() {
    const guessStatus = this.props.guessStatus;
    let correct;
    let incorrect;

    if (guessStatus) {
      correct = guessStatus.correct.pitch;
      incorrect = guessStatus.incorrect ? guessStatus.incorrect.pitch : null;
    }
    return (
      <div id="keyboard">{this.props.inputNotes.map((note) => {
        let status = '';
        if (correct == note) status = ' correct';
        else if (incorrect == note) status = ' incorrect';
        return (
          <button
            key={('keyboard-' + note)}
            className={'keyboard-button' + status}
            onClick={this.guessNote.bind(null, note)}>
            {note}
          </button>
        );
      }
      )}</div>
    );
  }

  guessNote = (pitch) => {
    DisplayActions.guessNote({pitch, octave: null});
  };

}
