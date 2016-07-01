import React from 'react';
import { findDOMNode } from 'react-dom';
import AltContainer from 'alt-container';
import Raphael from 'raphael';
window.Raphael = Raphael;

import StavesScreen from '../StavesScreen/StavesScreen.jsx';
import StartScreen from '../StartScreen/StartScreen.jsx';
import ScoreScreen from '../ScoreScreen/ScoreScreen.jsx';

import AuthStore from '../../logic/stores/AuthStore';
import GameStore from '../../logic/stores/GameStore';

export default class Display extends React.Component {
  render() {

    let screen = null;

    if (this.props.screen === 'staves') {
      screen = <StavesScreen />;
    } else if (this.props.screen === 'start') {
      screen = <StartScreen />;
    } else if (this.props.screen === 'score') {
      screen = <ScoreScreen />;
    } else {
      return null;
    }

    return (
      <AltContainer
        stores={{AuthStore, GameStore}}>
          {screen}
      </AltContainer>
    )
  }
}
