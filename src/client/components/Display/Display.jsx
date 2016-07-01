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
    if (this.props.screen === 'staves') {
      return <StavesScreen {...this.props} />
    } else if (this.props.screen === 'start') {
      return (
        <AltContainer
          stores={[AuthStore, GameStore]}
          inject={{
            fade: () => GameStore.getState().fadeCurDisplay,
            payload: () => AuthStore.getState().payload
          }}>
            <StartScreen />
        </AltContainer>
      )
    } else if (this.props.screen === 'score') {
      return (
        <ScoreScreen />
      )
    } else {
      return null;
    }
  }
}
