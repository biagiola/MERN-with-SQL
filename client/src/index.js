import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { StateProvider } from './store/StateProvider'
import reducer, { initialState } from './store/reducers/Reducer'

ReactDOM.render(

  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/* 
<React.StrictMode></React.StrictMode> no está en uso para evitar warnings con el Menu de MaterialUI-core
 */
