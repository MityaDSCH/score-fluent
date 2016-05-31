import alt from '../libs/alt';
import reqwest from 'reqwest';

import AuthActions from '../actions/AuthActions';

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
  }

  register(body) {
    reqwest({
      url: this.url + '/api/register',
      type: 'json',
      method: 'post',
      crossOrigin: true,
      contentType: 'application/x-www-form-urlencoded',
      data: body,
    }).then((res) => {
      if (!res.success) console.log(res);
      else {
        this.setState({
          payload: JSON.parse(atob(res.token.split('.')[1]))
        });
        this._setLocalToken(res.token);
        console.log(this.payload);
      }
    });
  }

  login(body) {
    reqwest({
      url: this.url + '/api/authenticate',
      type: 'json',
      method: 'post',
      crossOrigin: true,
      contentType: 'application/x-www-form-urlencoded',
      data: body,
    }).then((res) => {
      if (!res.success) console.log(res);
      else {
        this.setState({
          payload: JSON.parse(atob(res.token.split('.')[1]))
        });
        this._setLocalToken(res.token);
        console.log(this.payload);
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
