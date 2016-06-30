import React from 'react';

import GameActions from '../../logic/actions/GameActions';

export default class StartScreen extends React.Component {
  render() {
    return (
      <div id="display" className={'start' + (this.props.fade ? ' fade' : '')}>
        <h1 id="start" onClick={this.startTimed}>Start</h1>
        <div id="start-help">
          <div className="button">
            ?
            <div className="help-text">This is a bunch of text about what is about to happen when you click the start button</div>
          </div>
        </div>
      </div>
    )
  }

  startTimed() {
    GameActions.startTimed();
  }
}
