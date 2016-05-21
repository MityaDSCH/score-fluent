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
    this.updateNote(nextProps.note);
  }

  render() {
    var note = this.props.note;
    return (
      <div id="display"></div>
    );
  }

  //TODO: add key sig params to (draw/update)Stave
  drawStave(clef) {
    this.stave = new VF.Stave(10, -10, 100);
    this.stave.addClef(clef).setContext(this.ctx).draw();
  }

  updateStave(clef) {
    console.log(this.stave);
  }

  drawNote(note) {
    this.note = new VF.StaveNote({ keys: [this.props.note + "/4"], duration: "q" });
    if (this.props.note.length > 1) {
      this.note.addAccidental(0, new VF.Accidental(this.props.note.substr(1)));
    }

    var voice = new VF.Voice({
      num_beats: 1,
      beat_value: 4,
      resolution: VF.RESOLUTION
    }).addTickable(this.note);

    new VF.Formatter().formatToStave([voice], this.stave, {});

    voice.setStave(this.stave);

    voice.draw(this.ctx, this.stave);

    this.noteSet = this.paper.set();

    let counter = 0;
    this.paper.forEach((ele) => {
      if (counter > 7) this.noteSet.push(ele);
      counter++;
    });

  }

  updateNote(note) {
    this.noteSet.remove();
    setTimeout(() => this.drawNote(note), 0);
  }

}
