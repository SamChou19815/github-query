import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import store from './data/store';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('We messed up the DOM tree!');
}
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  rootElement
);
