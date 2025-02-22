import React from 'react';
const p = React.PropTypes;

export default class ButtonsInput extends React.Component {

  static propTypes = {
    inputNotes: p.arrayOf(p.string).isRequired,
    active: p.bool.isRequired,
    correctNote: p.string,
    incorrectNote: p.string,
    guessNote: p.func.isRequired
  }

  render() {

    const mapButtons = buttons => {
      return (
        <div className="row-container">
          {buttons.map((note, ind) => {
            let inactive = '';
            if (!this.props.active) inactive = ' inactive';

            // Set button class to var status if it corresponds to (in)correctNote
            let status = '';
            if (this.props.correctNote == note) status = ' correct';
            else if (this.props.incorrectNote == note) status = ' incorrect';

            return (
              <button
                key={ind}
                className={'keyboard-button' + inactive + status}
                onClick={this.props.active ? this.props.guessNote.bind(null, note) : null}>
                {note}
              </button>
            )
          })}
        </div>
      )
    }

    const row1 = mapButtons(this.props.inputNotes.slice(0, 6));
    const row2 = mapButtons(this.props.inputNotes.slice(6, 12));

    return (
      <div id="keyboard">
        {row1}
        {row2}
      </div>
    )
  }

}
