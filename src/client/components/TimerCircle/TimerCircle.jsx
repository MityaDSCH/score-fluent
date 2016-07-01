import React from 'react';
import Raphael from 'raphael';

export default class TimerCircle extends React.Component {

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.paper = Raphael('timer-container', '100%', '100%');
    this.width = getComputedStyle(document.querySelector('#timer-container'))['width'].replace('px', '');
    this.height = getComputedStyle(document.querySelector('#timer-container'))['height'].replace('px', '');
    this.paper.setViewBox(0, 0, this.width, this.height, true);

    // Sauce: https://stackoverflow.com/questions/5061318/drawing-centered-arcs-in-raphael-js
    this.paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = xloc + R * Math.cos(a),
            y = yloc - R * Math.sin(a),
            path;
        if (total == value) {
            path = [
                ["M", xloc, yloc - R],
                ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
            ];
        } else {
            path = [
                ["M", xloc, yloc - R],
                ["A", R, R, 0, +(alpha > 180), 1, x, y]
            ];
        }
        return {path};
    };
    this.maxLength = Math.max(this.width, this.height);
    this.arc = this.paper.path().attr({
        "stroke": "#0F0",
        "stroke-width": this.maxLength*2,
        arc: [this.width/2, this.height/2, 0, 100, this.maxLength]
    });
  }

  comonentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.timedTimeoutId && nextProps.timedTimeoutId) {
      this._animateTimer(this.props.timedDuration);
    } else if (this.props.timedTimeoutId && !nextProps.timedTimeoutId) {
      this._fadeTimer();
    }
  }

  render() {
    return (
      <div id="timer-container"></div>
    )
  }

  _handleResize() {
    this.width = getComputedStyle(document.querySelector('#timer-container'))['width'].replace('px', '');
    this.height = getComputedStyle(document.querySelector('#timer-container'))['height'].replace('px', '');
    this.paper.setViewBox(this.width, this.height, true);
  }

  _animateTimer(duration) {
    this.arc.attr({
      "opacity": 1,
      arc: [this.width/2, this.height/2, 0, 100, this.maxLength]
    });
    this.arc.animate({
      arc: [this.width/2, this.height/2, 100, 100, this.maxLength]
    }, duration, "ease");
    this.arc.animate({
      "stroke": "#F00"
    }, duration, "easeIn");
  }

  _fadeTimer() {
    this.arc.stop();
    this.arc.animate({
      "opacity": "0"
    }, 1000);
  }

}
