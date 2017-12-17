import React from 'react';
import { BrowserRouter as WebRouter, Route } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';

import PrivateRoute from './PrivateRoute';
import App from '../components/App';
import Login from '../components/Login';

class Router extends React.Component {
    render(){
      return(
          <WebRouter>
            <div id="root" className="dflex horizontalFlex fullHeight fullWidth">  
              <div id="sidebar" className="dflex verticalFlex fullHeight">
                <Nav bsStyle='pills' stacked className="textAlign-center dflex verticalFlex flex">
                  <NavItem href='/' className="navTitle">NPB</NavItem>
                  <NavItem className="flex"/>
                  <NavItem href='/login'>Prisijungti</NavItem>
                </Nav>
              </div>
              <div id="main" className="flex">
                <Route path="/login" component={Login}/>
                <PrivateRoute exact path="/" component={App}/>
              </div>
            </div>
          </WebRouter>
        )
    }
}
export default Router;