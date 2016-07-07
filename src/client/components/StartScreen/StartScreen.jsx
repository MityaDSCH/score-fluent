import React from 'react';

import GameActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

export default class StartScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      helpBtnActive: true,
      helpTextActive: false,
      animating: false
    };
  }

  render() {
    if (this.props.AuthStore.payload) {
      return this.loggedInStart();
    }
    return this.loggedOutStart();
  }

  startTimed() {
    MenuActions.setTimedMenu();
    GameActions.startTimed();
  }

  fadeInHelp(e) {
    e.stopPropagation();
    if (!this.state.animating) {
      this.setState({
        animating: true,
        helpBtnActive: false
      });
      setTimeout(() => {
        this.setState({helpTextActive: true});
        setTimeout(() => {
          this.setState({animating: false});
        }, 500);
      }, 500);
    }
  }

  fadeOutHelp(e) {
    e.stopPropagation();
    if (!this.state.animating) {
      this.setState({
        animating: true,
        helpTextActive: false
      });
      setTimeout(() => {
        this.setState({helpBtnActive: true});
        setTimeout(() => {
          this.setState({animating: false});
        }, 500);
      }, 500);
    }
  }

  loggedInStart() {
    return (
      <div
        id="display"
        className={'start' + (this.props.GameStore.fadeCurDisplay ? ' fade' : '')}
        onClick={this.fadeOutHelp.bind(this)}>
        <h1 id="start" onClick={this.startTimed}>Start</h1>
        <div
          className={'help-btn fadable' + (this.state.helpBtnActive ? ' active' : '')}
          onClick={this.fadeInHelp.bind(this)}
        >?</div>

        <div
          className={'help-text fadable' + (this.state.helpTextActive ? ' active' : '')}
        > Compete to get the highest score for the selected clefs, and
          difficulty by guessing as many notes as possible in 60 seconds.
        </div>
      </div>
    )
  }

  loggedOutStart() {
    return (
      <div id="display" className={'start' + (this.props.GameStore.fadeCurDisplay ? ' fade' : '')}>
        <h2 id="start-login-warning">You must log in or register to play timed mode</h2>
      </div>
    )
  }

}
