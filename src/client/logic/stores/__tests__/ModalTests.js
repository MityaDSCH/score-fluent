jest.unmock('../ModalStore');
jest.unmock('../../actions/ModalActions');

import alt from '../../libs/alt';

import ModalActions from '../../actions/ModalActions';
import ModalStore from '../ModalStore';

describe('ModalStore API', () => {

  function checkField(ind, val, state) {
    const fieldName = ModalStore.getState().formItems[ind].placeholder;
    if (val) ModalActions.updateFormValidation(fieldName, val);
    const field = ModalStore.getState().formItems[ind];
    if (val) expect(field.value).toBe(val);
    expect(field.validationState).toBe(state);
  }

  function testUsername(ind) {
    checkField(ind, '', 'clean');
    checkField(ind, 'aS', 'dirty');
    checkField(ind, '))___', 'dirty');
    checkField(ind, 'helloWorld1234!', 'valid');
  }

  describe('register()', () => {

    it('sets up registration form data', () => {
      ModalActions.register();

      let state = ModalStore.getState();
      expect(state.active).toBe(true);

      jest.runAllTimers();

      state = ModalStore.getState();
      expect(state.active).toBe(true);
      expect(state.cardClass).toBe('register');
      expect(state.valid).toBe(false);
      expect(state.authBody).toEqual({});

      const inputs = state.formItems
        .filter(item => item.type == 'input' || item.type == 'password')
      const placeholders = inputs.map(item => item.placeholder);
      expect(placeholders).toEqual(['Username', 'Email', 'Password', 'Confirm password']);
      inputs.forEach(input => {
        expect(input.value).toBe('');
        expect(input.error).toBe('');
        expect(input.validationState).toBe('clean');
      });
    });

    it('handles incorrect usernames', () => {
      testUsername(0);
    });

    // https://blogs.msdn.microsoft.com/testing123/2009/02/06/email-address-test-cases/
    it('handles incorrect emails', () => {
      checkField(1, '', 'clean');

      checkField(1, 'plainaddress', 'dirty');
      checkField(1, '#@%^%#$@#$@#.com	', 'dirty');
      checkField(1, 'email.domain.com', 'dirty');
      checkField(1, 'あいうえお@domain.com	', 'dirty');

      checkField(1, 'email@domain.com	', 'valid');
      checkField(1, 'firstname.lastname@domain.com', 'valid');
      checkField(1, 'email@subdomain.domain.com', 'valid');
      checkField(1, '1234567890@domain.com', 'valid');
    });

    it('handles incorrect passwords', () => {
      checkField(2, '', 'clean');
      checkField(3, '', 'clean');

      checkField(2, 'password', 'dirty');
      checkField(3, 'password', 'valid');

      checkField(2, 'password1', 'dirty');
      checkField(3, false, 'dirty');

      checkField(2, 'Password1', 'valid');
      checkField(3, 'password1', 'dirty');
      checkField(3, 'Password1', 'valid');

      checkField(2, 'p', 'dirty');
      checkField(3, false, 'dirty');
    });

    it('updates valid and authBody state', () => {

      const assertValid = () => expect(ModalStore.getState().valid).toBe(true);
      const assertBody = (username, email, password) =>
        expect(ModalStore.getState().authBody).toEqual({username, email, password});

      const assertInvalid = () => expect(ModalStore.getState().valid).toBe(false);
      const assertNoBody = () => expect(ModalStore.getState().authBody).toEqual({});

      checkField(0, 'asd', 'valid');
      assertInvalid();
      assertNoBody();
      checkField(1, 'asdf@asdf.com', 'valid');
      checkField(2, 'asdfASDF1', 'valid');
      checkField(3, 'asdfASDF1', 'valid');
      assertValid();
      assertBody('asd', 'asdf@asdf.com', 'asdfASDF1');

      checkField(0, 'as', 'dirty');
      assertInvalid();
      assertNoBody();

      checkField(0, 'asdf', 'valid');
      assertValid();
      assertBody('asdf', 'asdf@asdf.com', 'asdfASDF1');

      checkField(1, 'asdf@asdf', 'dirty');
      assertInvalid();
      assertNoBody();

      checkField(1, 'fdsa@fdsa.org', 'valid');
      assertValid();
      assertBody('asdf', 'fdsa@fdsa.org', 'asdfASDF1');

      checkField(2, 'asdfASDF', 'dirty');
      assertInvalid();
      assertNoBody();

      checkField(2, 'fdsaFDSA1!!', 'valid');
      assertInvalid();
      assertNoBody();

      checkField(3, false, 'dirty');
      checkField(3, 'fdsaFDSA1!!', 'valid');
      assertValid();
      assertBody('asdf', 'fdsa@fdsa.org', 'fdsaFDSA1!!');

    });

  });

  describe('close()', () => {
    it('closes', () => {
      ModalActions.close();

      let state = ModalStore.getState();
      expect(state.fade).toBe(true);

      jest.runAllTimers();
      state = ModalStore.getState();
      expect(state.active).toBe(false);
      expect(state.fade).toBe(false);
      expect(state.cardClass).toBe('');
    });
  });

  describe('login', () => {

    it('sets up login form data', () => {
      ModalActions.login();

      let state = ModalStore.getState();
      expect(state.active).toBe(true);

      jest.runAllTimers();

      state = ModalStore.getState();
      expect(state.active).toBe(true);
      expect(state.cardClass).toBe('login');
      expect(state.valid).toBe(false);
      expect(state.authBody).toEqual({});
    });

    it('handles incorrect usernames/emails', () => {
      testUsername(0);
    });

    it('handles incorrect passwords', () => {
      checkField(1, '', 'clean');
      checkField(1, 'password', 'dirty');
      checkField(1, 'password1', 'dirty');
      checkField(1, 'Password1', 'valid');
      checkField(1, 'p', 'dirty');
    });

    ModalActions.close();

  });

  describe('registerLoginFail()', () => {

    it('accepts register form submission failure', () => {
      ModalActions.register();
      ModalActions.updateFormValidation(['Username', 'asdf']);
      ModalActions.updateFormValidation(['Email', 'asdf@asdf.com']);
      ModalActions.updateFormValidation(['Password', 'asdfASDF1']);
      ModalActions.updateFormValidation(['Confirm password', 'asdfASDF1']);
      expect(ModalStore.getState().valid).toBe(true);

      ModalActions.registerLoginFail([{field: 'Username', message: 'username taken'}]);
      let state = ModalStore.getState();
      let item = state.formItems[0];
      expect(item.validationState).toBe('dirty');
      expect(item.error).toBe('username taken');
      expect(state.valid).toBe(false);

      checkField(0, 'asdffdsa', 'valid');
      state = ModalStore.getState();
      expect(state.valid).toBe(true);

      ModalActions.registerLoginFail([{field: 'Email', message: 'email taken'}]);
      state = ModalStore.getState();
      item = state.formItems[1];
      expect(item.validationState).toBe('dirty');
      expect(item.error).toBe('email taken');
      expect(state.valid).toBe(false);

      checkField(1, 'lksnd@asdf.com', 'valid');
      state = ModalStore.getState();
      expect(state.valid).toBe(true);

      ModalActions.close();
    });

    it('accepts login form submission failure', () => {
      ModalActions.login();
      ModalActions.updateFormValidation(['Username or Email', 'asdf']);
      ModalActions.updateFormValidation(['Password', 'asdfASDF1']);
      expect(ModalStore.getState().valid).toBe(true);

      ModalActions.registerLoginFail([{field: 'Username or Email', message: 'User not found'}]);
      let state = ModalStore.getState();
      let item = state.formItems[0];
      expect(item.validationState).toBe('dirty');
      expect(item.error).toBe('User not found');
      expect(state.valid).toBe(false);

      checkField(0, 'asdffdsa', 'valid');
      state = ModalStore.getState();
      expect(state.valid).toBe(true);
    });

  });

});
