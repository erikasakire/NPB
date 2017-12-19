/** Module imports */
import React from 'react';
import { BrowserRouter as WebRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';

/** Redux imports */
import { connect } from 'react-redux';
import { logout_user as removeAccessKey } from '../store/actions/loginActions';

/** Components */
import PrivateRoute from './PrivateRoute';
import App from '../components/App';
import Login from '../components/Login';
import Drivers from '../components/Drivers';
import Logout from '../components/Logout';
import Workers from '../components/Workers';
import Orders from '../components/Orders';


class Router extends React.Component {
    render(){
        return(
            <WebRouter>
                <div id="root" className="dflex horizontalFlex fullHeight fullWidth">  
                    <div id="sidebar" className="dflex verticalFlex fullHeight">
                        <ul className="textAlign-center dflex verticalFlex flex nav nav-pills nav-stacked">
                            <li>
                                <Link to='/' className="navTitle">
                                    NPB
                                </Link>
                            </li>
                            <li>
                                <hr/>
                            </li>
                            <li>
                                <Link to='/drivers'>
                                    Vairuotojai
                                </Link>
                            </li>
                            <li>
                                <Link to='/workers'>
                                    Darbuotojai
                                </Link>
                            </li>
                            <li>
                                <Link to='/orders'>
                                    Užsakymai
                                </Link>
                            </li>
                            <li className="flex"/>
                            <li>
                                { 
                                    this.props.logged ?
                                    <Link to='/logout'>Atsijungti</Link> :
                                    <Link to='/login'>Prisijungti</Link>
                                }
                            </li>
                        </ul>
                    </div>
                    <div id="main" className="flex">
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/logout" component={Logout}/>

                            <PrivateRoute exact path="/" component={App}/>
                            <PrivateRoute path="/drivers" component={Drivers}/>
                            <PrivateRoute path="/workers" component={Workers}/>
                            <PrivateRoute path="/orders" component={Orders}/>
                        </Switch>
                    </div>
                </div>
            </WebRouter>
        )
    }
}
export default connect(
    state => {
        return {
            logged: state.login != null
        }
    }
)(Router);