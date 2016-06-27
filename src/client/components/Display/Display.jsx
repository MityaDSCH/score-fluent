import React from 'react';
import { findDOMNode } from 'react-dom';
import Raphael from 'raphael';
window.Raphael = Raphael;

import Staves from '../Staves/Staves.jsx';

export default class Display extends React.Component {

  componentDidMount() {
    this.container = findDOMNode(this);
  }

  render() {

    if (this.props.screen === 'staves') {
      return <Staves {...this.props} />
    } else {
      return null;
    }

  }

}
