import React from 'react';

import ModalFormItem from '../ModalFormItem/ModalFormItem.jsx';

import ModalActions from '../../logic/actions/ModalActions';

export default class Modal extends React.Component {

  render() {
    return (
      this.props.active ?

        <div
          id="modal-background"
          className={this.props.fade ? 'fade' : ''}>
          <p
            id="back-button"
            onClick={() => ModalActions.close()}>Back</p>
          <div id="modal-card" className={this.props.cardClass}>
            {this.props.formItems.map((item, ind) =>
              <ModalFormItem key={ind} cardType={this.props.cardClass} item={item} valid={this.props.valid} />
            )}
          </div>
        </div>

        : null
    )
  }

}
