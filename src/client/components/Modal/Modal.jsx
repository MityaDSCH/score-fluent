import React from 'react';

import MenuItem from '../MenuItem/MenuItem.jsx';

import MenuActions from '../../logic/actions/MenuActions';

export default class Modal extends React.Component {

  render() {
    return (
      this.props.modal ?

        <div
          id="modal-background"
          className={this.props.fadeModal ? 'fade' : ''}>
          <p
            id="back-button"
            onClick={MenuActions.closeModal}>Back</p>
          <div id="modal-card" className={this.props.modalCardClass}>
            {this.props.modalFormItems.map((item, ind) =>
              <MenuItem key={ind} item={item} valid={this.props.valid} />
            )}
          </div>
        </div>

        : null
    )
  }

}
