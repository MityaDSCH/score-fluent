import alt from '../libs/alt';
import reqwest from 'reqwest';

import AuthActions from '../actions/AuthActions';

class AuthStore {

  constructor() {
    this.bindActions(AuthActions);

    this.user = null;
    this.url = window.location.host.indexOf('local') !== -1 ? 'http://localhost:9000' : window.location.origin;
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
      console.log(res);
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
      console.log(res);
    });
  }

}

export default alt.createStore(AuthStore, 'AuthStore');
