import React from 'react';

import GameActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

export default class StartScreen extends React.Component {

  render() {
    if (this.props.AuthStore.payload) {
      return this._loggedInStart();
    }
    return this._loggedOutStart();
  }

  startTimed() {
    MenuActions.setTimedMenu();
    GameActions.startTimed();
  }

  _loggedInStart() {
    return (
      <div id="display" className={'start' + (this.props.GameStore.fadeCurDisplay ? ' fade' : '')}>
        <h1 id="start" onClick={this.startTimed}>Start</h1>
        <div id="start-help">
          <div className="button">
            ?
            <div className="help-text">
              Compete to get the highest score for the selected clefs, and
              difficulty by guessing as many notes as possible in 60 seconds.
            </div>
          </div>
        </div>
      </div>
    )
  }

  _loggedOutStart() {
    return (
      <div id="display" className={'start' + (this.props.GameStore.fadeCurDisplay ? ' fade' : '')}>
        <h2 id="start-login-warning">You must log in or register to play timed mode</h2>
      </div>
    )
  }

}
