import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';

import AuthActions from './logic/actions/AuthActions';
import MenuActions from './logic/actions/MenuActions';

import AuthStore from './logic/stores/AuthStore';

const localToken = AuthStore.getPayload();
MenuActions.init(localToken);

ReactDOM.render(<App />, document.getElementById('app'));
