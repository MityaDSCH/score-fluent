import React from 'react';

export default class MenuItem extends React.Component {
  render() {
    const username = this.props.payload ? this.props.payload.username : null;
    return <p id='greeting' className={this.props.payload ? 'active' : ''}>Hi {username}!</p>
  }
}
