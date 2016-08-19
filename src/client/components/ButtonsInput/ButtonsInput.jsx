import React from 'react';
const p = React.PropTypes;

export default class ButtonsInput extends React.Component {

  static propTypes = {
    inputNotes: p.arrayOf(p.string).isRequired,
    correctNote: p.string,
    incorrectNote: p.string,
    guessNote: p.func.isRequired
  }

  render() {
    return (
      <div id="keyboard">
        {this.props.inputNotes.map((note, ind) => {
          // Set button class to var status if it corresponds to (in)correctNote
          let status = '';
          if (this.props.correctNote == note) status = ' correct';
          else if (this.props.incorrectNote == note) status = ' incorrect';

          return (
            <button
              key={ind}
              className={'keyboard-button' + status}
              onClick={this.props.guessNote.bind(null, note)}>
              {note}
            </button>
          )
        })}
      </div>
    )
  }

}
