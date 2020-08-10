import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { I18nextProvider } from 'react-i18next';
import i18nConfig from './config/i18n';
import App from './App';
import configureStore from './store/configure';

const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18nConfig}>
      <ReduxToastr
        transitionIn="fadeIn"
        preventDuplicates
        transitionOut="fadeOut"
      />
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('root'),
);
