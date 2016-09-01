import React from 'react';
const p = React.PropTypes;
import _ from 'lodash';

import { toSharp } from '../../libs/enharmonics';

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

  componentDidMount() {
    this._loadKeys();
    this._addKeyEventListeners();
  }

  render() {
    const base64Svg = require('../../assets/keyboard.svg');
    const match = base64Svg.match(/data:image\/svg[^,]*?[;base64]?,(.*)/)[1];
    const svg = atob(match);
    return (
      <div
        className='keyboard-container'
        alt='keyboard'
        dangerouslySetInnerHTML={{__html: svg}} />
    )
  }

  // Make this.keys element: HTMLElement, note: pitch ('i.e. A#')
  // Return true if all keys were found
  _loadKeys() {
    let allKeysFound = true;
    this.keys = this.props.inputNotes.map(keyName => {
      keyName = toSharp(keyName); // svg ids are sharp
      return {
        element: document.getElementById(keyName),
        pitch: keyName
      };
    });
    return allKeysFound;
  }

  // Attach props.guessNote to key paths
  _addKeyEventListeners() {
    // Attach props.guessNote
    this.keys.forEach(key => {
      key.element.addEventListener('click', () => {
        if (this.props.active) {
          this.props.guessNote(key.pitch);
        }
      })
    })
  }

}
