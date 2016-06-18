import alt from '../libs/alt';

class AuthActions {
  constructor() {
    this.generateActions('register', 'login', 'logout');
  }
}

export default alt.createActions(AuthActions);
