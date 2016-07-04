import reqwest from 'reqwest';

import alt from '../libs/alt';

import MenuActions from './MenuActions';
import ModalActions from './ModalActions';
import GameActions from './GameActions';

import AuthStore from '../stores/AuthStore';
import ModalStore from '../stores/ModalStore';
import GameStore from '../stores/GameStore';

class AuthActions {

  constructor() {
    this.generateActions(
      'init',
      'logScore',
      'logout'
    );
  }

  register(body) {
    this._authRequest(ModalStore.getAuthBody(), AuthStore.getUrl() + '/api/register');
    return null;
  }

  login(body) {
    this._authRequest(ModalStore.getAuthBody(), AuthStore.getUrl() + '/api/authenticate');
    return null;
  }

  submitScore() {
    const body = {
      _id: AuthStore.getPayload()._id,
      difficulty: GameStore.getDifficulty(),
      clefs: GameStore.getClefs(),
      score: GameStore.getScore()
    };
    reqwest({
      url: AuthStore.getUrl() + '/api/timed-score',
      type: 'json',
      method: 'post',
      crossOrigin: true,
      contentType: 'application/x-www-form-urlencoded',
      headers: {
        Authorization: AuthStore.getJwt()
      },
      data: body
    }).then((res) => {
      GameActions.logScore(res);
    }).fail((err, msg) => {
      console.log(err, msg);
    });
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
    }).fail((err, msg) => {
      ModalActions.registerLoginFail({field: 'password', message: msg});
    });
    return null;
  }

}

export default alt.createActions(AuthActions);
