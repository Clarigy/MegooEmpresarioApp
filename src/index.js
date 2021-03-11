import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/App.scss';
import App from './routes/App';

ReactDOM.render(<App />, document.getElementById('app'));


serviceWorker.unregister();
