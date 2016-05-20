import React from 'react';

export default class Note extends React.Component {
  render() {
    return (
      <div className='cur-note'>{this.props.note}</div>
    );
  }
}
