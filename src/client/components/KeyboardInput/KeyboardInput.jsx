import React from 'react';
const p = React.PropTypes;
import ISVG from 'react-inlinesvg';

export default class KeyboardInput extends React.Component {

  static propTypes = {
    inputNotes: p.arrayOf(p.string).isRequired,
    active: p.bool.isRequired,
    correctNote: p.string,
    incorrectNote: p.string,
    guessNote: p.func.isRequired
  }

  constructor() {
    super();
    this.keys = null;
  }

  componentWillUnmount() {
    this.keys.forEach(key => {
      key.element.removeEventListener('click');
    })
  }

  render() {
    return (
      <ISVG
        ref={ elem => this.keyboard = elem }
        onLoad={this._addKeyEventListeners.bind(this)}
        className='keyboard-container'
        uniquifyIDs={false}
        src={require('../../assets/keyboard.svg')}
        alt='keyboard'
        wrapper={React.DOM.div} />
    )
  }

  _addKeyEventListeners() {
    setTimeout(() => {
      // Make this.keys element: HTMLElement, note: pitch ('i.e. A#')
      this.keys = this.props.inputNotes.map(keyName => {
        return {
          element: document.getElementById(keyName),
          pitch: keyName
        };
      });
      console.log(this.keys.map(key => key.element));
      // Attach props.guessNote
      this.keys.forEach(key => {
        key.element.addEventListener('click', () => {
          if (this.props.active) {
            this.props.guessNote(key.pitch);
          }
        })
      })
    }, 300);
  }

}
