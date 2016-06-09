import React from 'react';
import { findDOMNode } from 'react-dom';
import Vex from 'vexflow';
const VF = Vex.Flow;

// Appends an SVG to the passed container and draws the given clef and note inside
export default class Staff extends React.Component {

  // --------------------------------------------------------------------------

  render() {
    console.log(this.props.type);
    return (
      <div className={'staff-container ' + this.props.type}>
        {this.props.type == 'lastStaff' ? <p>{'Last Note: ' + this.props.note.pitch + this.props.note.octave}</p> : ''}
      </div>
    );
  }

  componentDidMount() {

    this.container = findDOMNode(this);

    this._draw(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.guessStatus) {
      if (this.props.type == 'curStaff') this._updateNoteColor(nextProps.noteStatus);
    } else if (this.props.guessStatus && !nextProps.guessStatus) {
      this.container.innerHTML = '';
      this._draw(nextProps);
    }
  }

  // --------------------------------------------------------------------------

  _draw(props) {
    this.renderer = new VF.Renderer(this.container, VF.Renderer.Backends.RAPHAEL); // This appends the SVG
    this.ctx = this.renderer.getContext();

    this._drawStave(props.clef);
    this._drawNote(props.note);
  }

  _drawStave(clef) {
    this.stave = new VF.Stave(32, 29, 100);
    this.stave.addClef(clef).setContext(this.ctx).draw();
  }

  _drawNote(note) {

    // Record what objects are added to the canvas for a Raphael group
    this.ctx.paper.setStart();

    // Make VF note object
    const vfNote = new VF.StaveNote({ keys: [note.pitch + "/" + note.octave], duration: "q" });
    if (note.pitch.length > 1) { // Has accidental, i.e. 'Bb'
      vfNote.addAccidental(0, new VF.Accidental(note.pitch.substr(1)));
    }

    // Make VF measure
    const voice = new VF.Voice({
      num_beats: 1,
      beat_value: 4,
      resolution: VF.RESOLUTION
    }).addTickable(vfNote);

    new VF.Formatter().formatToStave([voice], this.stave, {});

    voice.setStave(this.stave);
    voice.draw(this.ctx, this.stave);

    this.noteSet = this.ctx.paper.setFinish(); // Close Raphael group
    this.noteSet.translate(15); // It's too close to the clef for some reason

    if (this.props.type == 'lastStaff') { // Immediately set note color of last guess
      if (this.props.noteStatus == 'correct') {
        this.noteSet.attr({stroke: '#00FF00', fill: '#00FF00'});
      } else {
        this.noteSet.attr({stroke: '#FF0000', fill: '#FF0000'});
      }
    }
  }

  _updateNoteColor(status) {
    if (status == 'correct') {
      this.noteSet.animate({
        stroke: '#00FF00',
        fill: '#00FF00'
      }, this.props.answerDelay*2/3);
    } else if (status == 'incorrect') {
      this.noteSet.animate({
        stroke: '#FF0000',
        fill: '#FF0000'
      }, this.props.answerDelay*2/3);
    }
  }

}
