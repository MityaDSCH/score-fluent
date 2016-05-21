import React from 'react';
import { findDOMNode } from 'react-dom';
import Raphael from 'raphael';
window.Raphael = Raphael;
import Vex from 'vexflow';

export default class Note extends React.Component {

  componentDidMount() {

    const canvas = findDOMNode(this);
    const renderer = new Vex.Flow.Renderer(canvas,
      Vex.Flow.Renderer.Backends.RAPHAEL);

    const ctx = renderer.getContext();
    const stave = new Vex.Flow.Stave(10, -10, 80);
    stave.addClef(this.props.clef).setContext(ctx).draw();

    // Create the notes
    var note = [new Vex.Flow.StaveNote({ keys: [this.props.note + "/4"], duration: "q" })];

    Vex.Flow.Formatter.FormatAndDraw(ctx, stave, note);
  }

  render() {
    var note = this.props.note;
    return (
      <div id="display"></div>
    );
  }

}
