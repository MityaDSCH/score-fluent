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
      key.element.removeEventListener('click', this._guessNote);
    })
  }

  componentDidMount() {
    this._loadKeys();
    this._addKeyEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    const updateNoteCss = (noteType, noteClass) => {
      const curNote = this.props[noteType];
      const nextNote = nextProps[noteType];
      if (curNote !== nextNote) {
        if (nextNote !== null) {
          const el = document.getElementById(toSharp(nextNote));
          this._addClass(el, noteClass);
        } else {
          const el = document.getElementById(toSharp(curNote));
          this._removeClass(el, noteClass);
        }
      }
    }

    updateNoteCss('correctNote', 'correct-key');
    updateNoteCss('incorrectNote', 'incorrect-key');
    
  }

  render() {
    const base64Svg = require('../../assets/keyboard.svg');
    const noMetadataSvg = base64Svg.match(/data:image\/svg[^,]*?[;base64]?,(.*)/)[1];
    const svg = atob(noMetadataSvg);
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
      key.element.addEventListener('click', this._guessNote.bind(this, key.pitch));
    });
  }

  _guessNote(pitch) {
    if (this.props.active) this.props.guessNote(pitch);
  }

  // http://youmightnotneedjquery.com/
  _addClass(el, className) {
    if (el.classList) {
     el.classList.add(className);
    } else {
     el.className += ' ' + className;
    }
  }

  _removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
}
