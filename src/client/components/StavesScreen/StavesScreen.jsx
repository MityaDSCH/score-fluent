import React from 'react';

import Staff from '../Staff/Staff.jsx';

export default class Staves extends React.Component {

  render() {
    return (
      <div id="display" className={'staves' + (this.props.GameStore.fadeCurDisplay ? ' fade' : '')}>
        {this.props.GameStore.lastStaff ?
          <div id='lastStaff' className='display-component'>
            <p>Last note:</p>
            <Staff
              clef={this.props.GameStore.lastStaff.clef}
              note={this.props.GameStore.lastStaff.note}
              noteStatus={this.props.GameStore.lastStaff.noteStatus}
              guessStatus={this.props.GameStore.guessStatus}
              answerDelay={this.props.GameStore.answerDelay}
              type='lastStaff'></Staff>
          </div>
        : null}

        {this.props.GameStore.curStaff ?
          <Staff
            clef={this.props.GameStore.curStaff.clef}
            note={this.props.GameStore.curStaff.note}
            noteStatus={this.props.GameStore.curStaff.noteStatus}
            guessStatus={this.props.GameStore.guessStatus}
            answerDelay={this.props.GameStore.answerDelay}
            type='curStaff'></Staff>
        : null}
      </div>
    )
  }

}
