import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { I18nextProvider } from 'react-i18next';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import i18nConfig from './config/i18n';
import App from './App';
import configureStore from './store/configure';
import { NOTIFICATIONS_TYPES, SHOW_NOTIFICATIONS } from './config/constants';

const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18nConfig}>
      {[NOTIFICATIONS_TYPES.TOASTR].includes(SHOW_NOTIFICATIONS) && (
        <ReduxToastr
          transitionIn="fadeIn"
          preventDuplicates
          transitionOut="fadeOut"
        />
      )}
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('root'),
);
