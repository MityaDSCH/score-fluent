import React from 'react';
import DownArrow from 'babel!svg-react!../../assets/downArrow.svg';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <div id="menu-card"></div>
        <div
          id="pulldown">
          <p className="pulldown-item">Menu</p>
          <DownArrow id="menu-pulldown-arrow" className="pulldown-item"/>
        </div>
      </div>
    );
  }

}
