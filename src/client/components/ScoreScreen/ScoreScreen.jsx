import React from 'react';

import AuthActions from '../../logic/actions/AuthActions';
import GameActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

export default class ScoreScreen extends React.Component {

  componentDidMount() {
    AuthActions.submitScore();

    // save clefs and difficulty from game to display
    this.setState({
      clefs: this.props.GameStore.clefs,
      difficulty: this.props.GameStore.difficulty
    });
  }

  render() {
    const gameStore = this.props.GameStore;
    const lb = gameStore.leaderboard;
    let screen = null;

    if (lb) {
      if (lb.success) {

        screen = (
          <div id="display" className={gameStore.fadeCurDisplay ? ' fade' : ''}>
            <p className='title'>{this._clefString(this.state.clefs)}</p>
            <p className='title'>on {this.state.difficulty}</p>

            <div id='scores'>

              <div id='user-scores'>
                <h3 className='score-header'>Your score</h3>
                <p>Correct: {gameStore.correct.length}</p>
                <p>Incorrect: {gameStore.incorrect.length}</p>
                <p>This round: {gameStore.score}</p>
                <p>High score: {lb.highScore}</p>
              </div>

              <div id='leaderboard'>
                <h3 className='score-header'>Leaderboard</h3>
                {gameStore.leaderboard.topScores.map((entry, ind) => {
                  return  <p
                            className='top-score'
                            key={entry.username}>
                              {entry.username + ': ' + entry.score}
                          </p>
                })}
              </div>

            </div>

            <p
              className='play-again'
              onClick={this.startTimed}>Play Again</p>
          </div>
        );
      } else {
        screen = <h2 className='score-center'>Error connecting to server</h2>
      }
    } else {
      screen = <h2 className='score-center'>Loading...</h2>
    }

    return screen;
  }

  startTimed() {
    MenuActions.setTimedMenu();
    GameActions.startTimed();
  }

  // turn array of clefs into grammatical list
  _clefString(clefs) {
    let clefString = '';
    clefs = clefs.map(clef => this._capitalize(clef));
    if (clefs.length == 1) {
      clefString = clefs[0] + ' clef';
    } else if (clefs.length == 2) {
      clefString = clefs[0] + ' and ' + clefs[1] + ' clef'
    } else {
      // all clefs except the last
      for (var i = 0; i < clefs.length - 1; i++) {
        clefString += clefs[i] + ', ';
      }
      clefString += '& ' + clefs[clefs.length-1] + ' clefs';
    }
    return clefString;
  }

  _capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

}
