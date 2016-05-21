import React from 'react';

export default class Note extends React.Component {
  render() {
    var note = this.props.note;
    console.log('RENDER DISPLAY', note);
    return (
      <div className='cur-note'>{this.props.note}</div>
    );
  }
}
