import React from 'react';
import { findDOMNode } from 'react-dom';
import Raphael from 'raphael';
window.Raphael = Raphael;

import Staff from '../Staff/Staff.jsx';

export default class Display extends React.Component {

  componentDidMount() {
    this.container = findDOMNode(this);
  }

  render() {
    return (
      <div id="display">
        {this.props.lastStaff ?
          <Staff
            clef={this.props.lastStaff.clef}
            note={this.props.lastStaff.note}
            noteStatus={this.props.lastStaff.noteStatus}
            guessStatus={this.props.guessStatus}
            answerDelay={this.props.answerDelay}
            type='lastStaff'></Staff>
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
    );
  }

}
