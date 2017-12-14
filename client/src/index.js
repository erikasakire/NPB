import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink
  } from 'react-router-dom'
import './index.css';
//import bootstrap from 'react-bootstrap';
import App from './components/App';
import Login from './components/Login'
import logo from './logo.svg';


class WebRouter extends React.Component {
        render(){
          return(
              <Router>
                <div id="root" class="dflex verticalFlex">  
                  <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h1 className="App-title">Welcome to React</h1>
                  </header>
                  <div class="dflex horizontalFlex flex">
                    <div id="sidebar" class="dflex verticalFlex">
                      <nav class="nav flex-column flex">
                        <a class="nav-link menu_button"><Link to="/">Home</Link></a>
                        <a class="nav-link menu_button" href="#"><Link to="/about">About</Link></a>
                        <a class="flex"></a>
                        <a class="nav-link menu_button" href="#"><Link to="/login">Prisijungimas</Link></a>              
                      </nav>
                    </div>
                    <div id="main" class="flex">
                      <Route exact path="/" component={App}/>
                      <Route exact path="/login" component={Login}/>
                    </div>
                  </div>
                </div>
              </Router>
            )
        }
}

ReactDOM.render(<WebRouter />, document.getElementById('root'));