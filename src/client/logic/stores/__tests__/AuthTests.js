jest.unmock('../AuthStore');
jest.mock('../../actions/AuthActions');

import alt from '../../libs/alt';

import AuthActions from '../../actions/AuthActions';
import AuthStore from '../AuthStore';

// ----------------------------------------------------------------------------
// setup localStorage

jest.unmock('mock-localstorage');

import MockLocalStorage from 'mock-localstorage';
const localStorage = new MockLocalStorage();

Object.defineProperty(window, 'localStorage', {value: localStorage});

// ----------------------------------------------------------------------------

describe('AuthStore API', () => {

  describe('init()', () => {
    it('inits payload when there is no stored token', () => {
      expect(localStorage.getItem('token')).toBeUndefined();

      alt.dispatcher.dispatch({
        data: null,
        action: AuthActions.INIT
      });
      expect(AuthStore.getPayload()).toBeNull();
    });

    it('inits payload when there is a stored token', () => {

      const token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzVlMjI1NGZmODgwNGRmNzY2NDMyM2UiLCJ1c2VybmFtZSI6ImFzZGYiLCJlbWFpbCI6ImFzZGZAYXNkZi5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTQ2NjcxNjY0MCwiZXhwIjoxNDk4Mjc0MjQwfQ.QxgWbomqMtZgeEjnqL31OVx93Kz0bEVIRYM3DIXsN_4";
      const parsedToken = {
        "_id": "575e2254ff8804df7664323e",
        "username": "asdf",
        "email": "asdf@asdf.com",
        "role": "User",
        "iat": 1466716640,
        "exp": 1498274240
      };

      localStorage.setItem('token', token);
      expect(localStorage.getItem('token')).toBe(token);

      alt.dispatcher.dispatch({
        data: null,
        action: AuthActions.INIT
      });
      expect(AuthStore.getPayload()).toEqual(parsedToken);
    });

  });

  describe('logout()', () => {
    it('removes token from localStorage and resets payload', () => {
      alt.dispatcher.dispatch({
        data: null,
        action: AuthActions.LOGOUT
      });

      expect(localStorage.getItem('token')).toBeUndefined();
      expect(AuthStore.getPayload()).toBeNull();
    });
  });

});
