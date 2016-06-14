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

    let percentCorrect = null;
    if (this.props.numGuesses != 0) {
      percentCorrect = Math.floor(100*(this.props.correct.length / this.props.numGuesses));
    }
    console.log(percentCorrect);

    return (
      <div id="display">
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

        {percentCorrect != null ?
          <div id='percent' className='display-component'>
            <h1>{percentCorrect + '%'}</h1>
          </div>
        : null}
      </div>
    );
  }

}
