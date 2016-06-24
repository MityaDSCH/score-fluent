import reqwest from 'reqwest';

import alt from '../libs/alt';

import MenuActions from './MenuActions';
import ModalActions from './ModalActions';

import AuthStore from '../stores/AuthStore';
import ModalStore from '../stores/ModalStore';

class AuthActions {
  constructor() {
    this.generateActions('init', 'logout');
  }

  register(body) {
    this._authRequest(ModalStore.getAuthBody(), AuthStore.getUrl() + '/api/register');
    return null;
  }

  login(body) {
    this._authRequest(ModalStore.getAuthBody(), AuthStore.getUrl() + '/api/authenticate');
    return null;
  }

  _authRequest(body, url) {
    reqwest({
      url,
      type: 'json',
      method: 'post',
      crossOrigin: true,
      contentType: 'application/x-www-form-urlencoded',
      data: body,
    }).then((res) => {
      if (!res.success) {
        ModalActions.registerLoginFail(res.invalidFields);
      }
      else {
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        localStorage.setItem('token', res.token);

        this.init();
        MenuActions.registerLoginSuccess(payload);
        ModalActions.close();
      }
    });
    return null;
  }
}

export default alt.createActions(AuthActions);
