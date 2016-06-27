import React from 'react';

import Staff from '../Staff/Staff.jsx';

export default class Staves extends React.Component {

  render() {
    return (
      <div id="display" className={this.props.fadeCurDisplay ? 'fade' : ''}>
        {this.props.lastStaff ?
          <div id='lastStaff' className='display-component'>
            <p>Last note:</p>
            <Staff
              clef={this.props.lastStaff.clef}
              note={this.props.lastStaff.note}
              noteStatus={this.props.lastStaff.noteStatus}
              guessStatus={this.props.guessStatus}
              answerDelay={this.props.answerDelay}
              type='lastStaff'></Staff>
          </div>
        : null}

        {this.props.curStaff ?
          <Staff
            clef={this.props.curStaff.clef}
            note={this.props.curStaff.note}
            noteStatus={this.props.curStaff.noteStatus}
            guessStatus={this.props.guessStatus}
            answerDelay={this.props.answerDelay}
            type='curStaff'></Staff>
        : null}
      </div>
    )
  }

}
