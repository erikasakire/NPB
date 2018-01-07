/** Module imports */
import React from 'react';
import { BrowserRouter as WebRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';

/** Notifications */
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

/** Redux imports */
import { connect } from 'react-redux';
import { logout_user as removeAccessKey } from '../store/actions/loginActions';

/** Rights */
import { moderator, administrator } from './Rights';

/** Custom elements for routing */
import PrivateRoute from './PrivateRoute';
import PrivateLink from './PrivateLink';

/** Components */
import App from '../components/App';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Padaliniai from '../components/Padaliniai';
import Produkcija from '../components/Produkcija';
import Darbuotojas from '../components/Darbuotojas';
import Preke from '../components/Preke';
import Padalinys from '../components/Padalinys';
import Ataskaita from '../components/Ataskaita';
import Workers from '../components/Workers';
import Orders from '../components/Orders1';
import Order from '../components/Order';
import Drivers from '../components/Drivers';
import Vehicles from '../components/Vehicles';
import Settings from '../components/Settings';

class Router extends React.Component {
    render(){
        return(
            <WebRouter>
                <div id="root" className="dflex horizontalFlex fullHeight fullWidth">  
                    <div id="sidebar" className="dflex verticalFlex fullHeight">
                        <nav className="textAlign-center dflex verticalFlex flex">
                            <Link to='/' className="navTitle">NPB</Link>
                            <hr/>
                            {
                                this.props.logged ? 
                                [
                                    <p key="0" className="Initials">Sveiki {this.props.name} {this.props.surname}</p>,
                                    <PrivateLink key="1" to="/settings" className="text-center">
                                        <svg height='18' width='18'>
                                            <path d='M 0 5.88 1.75 2.86 2.28 2.67 4.46 3.54 5.93 2.68 6.27 0.37 6.69 0 10.19 0 10.62 0.37 10.95 2.68 12.43 3.54 14.6 2.67 15.14 2.86 16.88 5.88 16.78 6.44 14.93 7.88 15 8.74 14.93 9.6 16.78 11.04 16.88 11.6 15.14 14.62 14.6 14.81 12.43 13.94 10.95 14.8 10.62 17.11 10.19 17.48 6.69 17.48 6.27 17.11 5.93 14.8 4.46 13.94 2.28 14.81 1.75 14.62 0 11.6 0.11 11.04 1.95 9.6 1.89 8.74 1.95 7.88 0.11 6.44 Z' fill='#BCBEC0'/>
                                            <circle cx='8.44' cy='8.74' r='3.06' fill='#192231'/>
                                        </svg>
                                    </PrivateLink>,
                                    <hr key="2"/>
                                ] :
                                null
                            }
                            <Link to='/padaliniai'>Padaliniai</Link>
                            <Link to='/produkcija'>Produkcija</Link>
                            <Link to='/produkcija/ataskaita'>Produktų judėjimo ataskaita</Link>
                            <PrivateLink to='/workers' userRights={[moderator, administrator]}>Darbuotojai</PrivateLink>
                            <PrivateLink to='/drivers' userRights={[moderator, administrator]}>Vairuotojai</PrivateLink>
                            <Link to='/orders'>Užsakymų vykdymas</Link>
                            <Link to="/order">Užsakymai</Link>
                            <Link to="/vehicle">Transporto priemonės</Link>
                            <section className="flex"></section>
                            { 
                                this.props.logged ?
                                <Link to='/logout'>Atsijungti</Link> :
                                <Link to='/login'>Prisijungti</Link>
                            }
                            
                        </nav>
                    </div>
                    <div id="main" className="flex">
                        <Switch>
                            <Route exact path="/login"    component={Login}   />
                            <Route exact path="/logout"   component={Logout}  />
                            
                            <PrivateRoute exact path="/"                        component={App}         fallback="/login" />
                            <PrivateRoute exact path="/padaliniai"              component={Padaliniai}      />
                            <PrivateRoute exact path="/produkcija"              component={Produkcija}      />
                            <PrivateRoute exact path="/produkcija/ataskaita"    component={Ataskaita}       />
                            <PrivateRoute       path="/darbuotojas/:id"         component={Darbuotojas}     />
                            <PrivateRoute       path="/produkcija/:id"          component={Preke}           />
                            <PrivateRoute       path="/padaliniai/:id"          component={Padalinys}       />
                            <PrivateRoute       path="/drivers"                 component={Drivers}     userRights={[moderator, administrator]}    />
                            <PrivateRoute       path="/workers"                 component={Workers}     userRights={[moderator, administrator]}    />
                            <PrivateRoute       path="/orders"                  component={Order}           />
                            <PrivateRoute       path="/order"                   component={Orders}          />
                            <PrivateRoute       path="/vehicle"                 component={Vehicles}        />
                            <PrivateRoute       path="/settings"                component={Settings}                />
                        </Switch>
                    </div>
                    <NotificationContainer/>
                </div>
            </WebRouter>
        )
    }
}
export default connect(
    state => {
        return {
            logged: state.login != null,
            name: state.user != null ? state.user.vardas : null,
            surname: state.user != null ? state.user.pavarde : null,
        }
    }
)(Router);