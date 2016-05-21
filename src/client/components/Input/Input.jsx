import React from 'react';

import NoteActions from '../../alt/actions/NoteActions';

export default class App extends React.Component {

  render() {

    const notes = ['A', 'Bb', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];

    return (
      <div id="keyboard">{notes.map(note =>
        <button
          key={('keyboard-' + note)}
          className={'keyboard-button' + (this.props.note === note ? ' active' : '')}
          onClick={this.setNote.bind(null, note)}>
          {note}
        </button>
      )}</div>
    );
  }

  setNote = (note) => {
    NoteActions.set(note);
  };

}
