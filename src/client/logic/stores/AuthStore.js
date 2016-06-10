import alt from '../libs/alt';
import reqwest from 'reqwest';

import AuthActions from '../actions/AuthActions';
import MenuActions from '../actions/MenuActions';
import ModalActions from '../actions/ModalActions';

class AuthStore {

  constructor() {
    this.bindActions(AuthActions);

    this.url = window.location.host.indexOf('local') !== -1 ? 'http://localhost:9000' : window.location.origin;

    const localToken = this._getLocalToken();
    if (!localToken) {
      this.payload = null;
    } else {
      this.payload = JSON.parse(atob(localToken.split('.')[1]));
    }

    this.exportPublicMethods({
      getPayload: () => this.payload || null
    });
  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  register(body) {
    this._authRequest(body, this.url + '/api/register');
  }

  login(body) {
    this._authRequest(body, this.url + '/api/authenticate');
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({payload: null});
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

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
        this.setState({payload});
        this._setLocalToken(res.token);
        MenuActions.registerLoginSuccess(payload);
        ModalActions.close();
      }
    });
  }

  _getLocalToken() {
    try {
      return localStorage.getItem('token');
    } catch(e) {
      return null;
    }
  }

  _setLocalToken(token) { // Stringify first!
    localStorage.setItem('token', token);
  }

}

export default alt.createStore(AuthStore, 'AuthStore');
