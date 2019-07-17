import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import './card_list.css';
import App from './components/App';
import storeApp from './components/redux/reducers';
import * as serviceWorker from './serviceWorker';
import { loadState, saveState } from './local_storage';

const persistedState = loadState();
const store = createStore(storeApp, persistedState);

store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render(<App store={store}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
