import React from 'react';
import { findDOMNode } from 'react-dom';
import Raphael from 'raphael';
window.Raphael = Raphael;
import Vex from 'vexflow';
const VF = Vex.Flow;

export default class Display extends React.Component {

  componentDidMount() {

    this.canvas = findDOMNode(this);
    this.renderer = new VF.Renderer(this.canvas,
      VF.Renderer.Backends.RAPHAEL);
    this.ctx = this.renderer.getContext();
    this.paper = this.ctx.paper;
    window.paper = this.paper;

    this.drawStave(this.props.clef);
    this.drawNote(this.props.note);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.guessStatus) this.updateNoteStatus(nextProps.guessStatus);
    else this.updateNote(nextProps.note);
  }

  render() {
    return (
      <div id="display"></div>
    );
  }

  //TODO: add key sig params to (draw/update)Stave
  drawStave(clef) {
    this.stave = new VF.Stave(50, 40, 100);
    this.stave.addClef(clef).setContext(this.ctx).draw();
  }

  drawNote(note) {
    this.paper.setStart(); // Record what objects are added to the canvas

    // ------------------------------------------------------------------------
    // Draw given note
    this.note = new VF.StaveNote({ keys: [note.pitch + "/" + note.octave], duration: "q" });
    if (note.pitch.length > 1) {
      this.note.addAccidental(0, new VF.Accidental(note.pitch.substr(1)));
    }

    var voice = new VF.Voice({
      num_beats: 1,
      beat_value: 4,
      resolution: VF.RESOLUTION
    }).addTickable(this.note);

    new VF.Formatter().formatToStave([voice], this.stave, {});

    voice.setStave(this.stave);

    voice.draw(this.ctx, this.stave);
    // ------------------------------------------------------------------------

    this.noteSet = this.paper.setFinish(); // Make set of all added elements in note drawing
    this.noteSet.translate(15); // It's too close to the clef for some reason

  }

  updateNoteStatus(status) {
    const noteSet = this.noteSet;
    if (!status.incorrect) {
      noteSet.animate({
        stroke: '#00FF00',
        fill: '#00FF00'
      }, this.props.answerDelay);
    } else {
      this.noteSet.animate({
        stroke: '#FF0000',
        fill: '#FF0000'
      }, this.props.answerDelay);
    }
  }

  updateNote(note) {
    this.noteSet.remove();
    this.drawNote(note);
  }

}
