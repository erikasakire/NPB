/** Module imports */
import React from 'react';
import ReactDOM from 'react-dom';

<<<<<<< HEAD
import Padaliniai from './components/Padaliniai';
import Produkcija from './components/Produkcija';
import Darbuotojas from './components/Darbuotojas';
import Preke from './components/Preke';

//ReactDOM.render(<Padaliniai />, document.getElementById('root'));
//ReactDOM.render(<Produkcija />, document.getElementById('root'));
//ReactDOM.render(<Darbuotojas />, document.getElementById('root')); 
ReactDOM.render(<Preke />, document.getElementById('root'));
=======
/** Redux store */
import { Provider } from 'react-redux';
import store from './store/store';

/** Style imports */
import './styles/index.css';
import './styles/extra.css';

/** Component imports */
import Router from './Router/Router';


ReactDOM.render(
  <Provider store={store}>
    <Router/>
  </Provider>, 
document.getElementById('entry'));
>>>>>>> master
