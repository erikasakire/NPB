/** Module imports */
import React from 'react';
import ReactDOM from 'react-dom';

/** Redux store */
import { Provider } from 'react-redux';
import store from './store/store';

/** Style imports */
import './styles/index.css';
import './styles/extra.css';

/** Component imports */
import Orders from './components/Orders'


<<<<<<< HEAD
ReactDOM.render(<Orders />, document.getElementById('root'));
=======
ReactDOM.render(
  <Provider store={store}>
    <Router/>
  </Provider>, 
document.getElementById('entry'));
>>>>>>> refs/remotes/origin/master
