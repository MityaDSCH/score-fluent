import React from 'react';
import _ from 'lodash';

const p = React.PropTypes;

import playNote from '../../libs/notes';
import GameActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

import ButtonsInput from '../ButtonsInput/ButtonsInput.jsx';
import KeyboardInput from '../KeyboardInput/KeyboardInput.jsx';

export default class App extends React.Component {

  static propTypes = {
    screen: p.string,
    guessStatus: p.object,
    inputNotes: p.shape({
      flat: p.arrayOf(p.string),
      sharp: p.arrayOf(p.string)
    }),
    accidental: p.string,
    answerDelay: p.number,
    audio: p.string
  };

  constructor() {
    super();

    this.state = {
      correctNote: null,
      incorrectNote: null
    };

    this.timeouts = []

  }

  componentWillReceiveProps(nextProps) {
    // Update button animation on props.guessStatus change
    if (!this.props.guessStatus && nextProps.guessStatus) {
      const status = nextProps.guessStatus;
      // If displaying the result of the last guess status won't be null
      if (status) {
        if (status.guess == 'correct') {
          this.setCorrectNote(status.correct);
        } else {
          this.setIncorrectNote(status.incorrect);
          this.timeouts.push(setTimeout(() => {
            this.setCorrectNote(status.correct);
          }, this.props.answerDelay));
        }
      }
    } else {
      // GuessStatus is null after new note is set, so remove animations
      this.setState({correctNote: null, incorrectNote: null});
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  render() {
    this.active = this.props.screen === 'staves';
    const guessStatus = this.props.guessStatus;
    let correct;
    let incorrect;

    // Lord forgive me for I have sinned and manipulated a grandparent's state from here
    const background = document.querySelector('#app-background');
    if (background) background.className = (guessStatus ? guessStatus.guess : '');

    return (
      <ButtonsInput
        inputNotes={this.props.inputNotes[this.props.accidental]}
        active={this.props.screen === 'staves'}
        correctNote={this.state.correctNote}
        incorrectNote={this.state.incorrectNote}
        guessNote={this.guessNote}/>
    );

    // return (
    //   <KeyboardInput
    //     inputNotes={this.props.inputNotes[this.props.accidental]}
    //     active={this.props.screen === 'staves'}
    //     correctNote={this.state.correctNote}
    //     incorrectNote={this.state.incorrectNote}
    //     guessNote={this.guessNote} />
    // );

  }

  guessNote = (pitch) => {
    // guessStatus is null unless a prev guess is being animated
    if (!this.props.guessStatus) {
      GameActions.guessNote({pitch, octave: null});
      MenuActions.updateScore();
    }
  };

  setCorrectNote(note) {
    this.setState({correctNote: note.pitch});
    playNote(this.props.audio, note, this.props.answerDelay);
  }

  setIncorrectNote(note) {
    this.setState({incorrectNote: note.pitch});
    playNote(this.props.audio, note, this.props.answerDelay);
  }

}
