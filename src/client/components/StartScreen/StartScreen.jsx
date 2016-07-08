import React from 'react';

import GameActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

export default class StartScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      helpBtnActive: true,
      helpTextActive: false,
      animating: false,
      timeoutIds: []
    };
  }

  componentWillUnmount() {
    this.state.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
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
      let timeout = setTimeout(() => {
        this.setState({helpTextActive: true});
        timeout = setTimeout(() => {
          this.setState({animating: false});
        }, 500);
        this._addTimeout(timeout);
      }, 500);
      this._addTimeout(timeout);
    }
  }

  fadeOutHelp(e) {
    e.stopPropagation();
    if (!this.state.animating && this.state.helpTextActive) {
      this.setState({
        animating: true,
        helpTextActive: false
      });
      let timeout = setTimeout(() => {
        this.setState({helpBtnActive: true});
        timeout = setTimeout(() => {
          this.setState({animating: false});
        }, 500);
        this._addTimeout(timeout);
      }, 500);
      this._addTimeout(timeout);
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

  _addTimeout(timeoutId) {
    this.setState({
      timeoutIds: this.state.timeoutIds.concat(timeoutId)
    });
  }

}
