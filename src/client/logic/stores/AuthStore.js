import alt from '../libs/alt';

import AuthActions from '../actions/AuthActions';

class AuthStore {

  constructor() {
    this.bindActions(AuthActions);

    this.url = null;
    this.payload = null;

    this.exportPublicMethods({
      getUrl: () => this.url,
      getPayload: () => this.payload || null
    });
  }

  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------

  init() {
    const url = window.location.host.indexOf('local') !== -1 ? 'http://localhost:9000' : window.location.origin;
    let payload;

    const localToken = this._getLocalToken();
    if (!localToken) {
      payload = null;
    } else {
      payload = JSON.parse(atob(localToken.split('.')[1]));
    }

    this.setState({url, payload});
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({payload: null});
  }

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  _getLocalToken() {
    try {
      return localStorage.getItem('token');
    } catch(e) {
      return null;
    }
  }

}

export default alt.createStore(AuthStore, 'AuthStore');
