import alt from '../libs/alt';

class ModalActions {
  constructor() {
    this.generateActions(
      'close',
      'register',
      'login',
      'updateFormValidation',
      'registerLoginFail'
    );
  }
}

export default alt.createActions(ModalActions);
