import React from 'react';

import AuthActions from '../../logic/actions/AuthActions';

export default class ScoreScreen extends React.Component {

  componentDidMount() {
    AuthActions.submitScore();
  }

  render() {
    return (
      <div id='score-loading'>Loading...</div>
    )
  }

}
