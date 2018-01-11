/** Module imports */
import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { login_user } from '../store/actions/loginActions';
import { Route, Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Cookies from 'js-cookie';

/** JS imports */
import { worker, moderator, administrator, driver } from './Rights.js';

import Login from '../components/Login';
import userDataReducer from '../store/reducers/userDataReducer';

class PrivateRoute extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            /** @var Boolean logged - determines if auto loggin was successful or not.
             *  Posible values:
             *      undefined - user auto login is not called or not ended yet.
             *      true - user successfuly logged
             *      false - user not logged
             */
            logged: undefined,

            /** @var mixed responseData - data returned by request, used in redux store */
            responseData: undefined
        };

        this.debug = false;
    }
    render(){

        if (this.debug){ console.log(this.props); }

        /** Redirection page if user is not valid to use this page */
        let redirectFallback = <Redirect to={this.props.fallback} />;
        
        let routeTo = this.props.location.state == undefined ?
            /** Just route when system asks for Route */
            <Route exact={this.props.exact} path={this.props.path} component={this.props.component} /> :
            /** Redirection page if user is valid to access this page and request was fowarded */
            <Redirect to={this.props.location.state} />
        
        /**
         * Tries to loggin into the system.
         * @param {Strign} username user username
         * @param {String} password user password
         */
        let login = (username, password) => {
            console.log("from auto login")
            if (username == undefined || username == "undefined"){
                if (this.debug){ console.log("Username is not given."); }
                return false;
            }
            if (password == undefined || password == "undefined"){
                if (this.debug){ console.log("Password is not given."); }
                return false;
            }

            Login.tryLogin(username, password)
            .then(response => {
                switch(response.status){
                    case 200: { /** Successfuly logged */
                        if (this.debug){ console.log("Successfuly logged."); }
                        return response.json()
                        .then(response => {
                            return this.props.loginAction(Object.assign({}, response, {username: username}));
                        });
                    }
                    case 400: { /** Not logged */
                        if (this.debug){ console.log("Not logged."); }
                        return this.setState({
                            logged: false
                        });
                    }
                }
            });

            return true;
        }

        /**
         * Checks if logged user rights is in rights whitelist.
         * @param {Array|Number} posibleRights array of just number of white listed rights.
         * @param {Number|String} userRights string or number representation of user rights.
         */
        let checkRights = (posibleRights, userRights) => {
            if (posibleRights == undefined){
                if (this.debug){ console.log("posibleRights is undefined"); }
                return false;
            }
            if (userRights == undefined){
                if (this.debug){ console.log("userRights is indefined"); }
                return false;
            }
            if (!(Array.isArray(posibleRights)) && !(posibleRights instanceof Number)){
                if (this.debug){ console.log("posible rights is not array or number"); }
                return false;
            }
            
            if(typeof userRights == "string"){
                if (this.debug){ console.log("User rights is string. Converting"); }
                userRights = parseInt(userRights);
            }
            else if(userRights instanceof Number){
                if(this.debug){ console.log("User rights is number"); }
            }
            else{
                if(this.debug){ console.log("User rights is typeof " + (typeof userRights)); }
                return false;
            }

            if (Array.isArray(posibleRights)){
                if (this.debug){ console.log("Posible rights is Array"); }
                if (posibleRights.indexOf(userRights) != -1){
                    if (this.debug){ console.log("User is verified"); }
                    return true;
                }
                if (this.debug){ console.log("User is not verified"); }
                return false;
            }
            else if (posibleRights instanceof Number){
                if (this.debug){ console.log("Posible rights is number"); }
                if (posibleRights == userRights){
                    if(this.debug){ console.log("User is verified"); }
                    return true
                }
                if (this.debug){ console.log("User is not verified"); }
                return false;
            }
            else{
                if (this.debug){ console.log("Posible rights is type of " + (typeof posibleRights)); }
                return false;
            }

            return false;
        }
        

        if (this.props.logged){ /** User is logged */
            if (this.debug){ console.log("User is logged"); }
            if (checkRights(this.props.userRights, this.props.rights)){ /** User is verified */
                if (this.debug){console.log("User is verified"); }
                return routeTo;
            }
            else{ /** User is not verified */
                if (this.debug){ console.log("User is not verified"); }
                NotificationManager.info("Šio puslapio pasiekimas yra apribotas.", "Negalima pasiekti pusalpio");
                return redirectFallback;
            }
        }
        else{ /** User is not logged */
            if (this.debug){ console.log("User is not logged"); }
            let username = Cookies.get("username"); if (this.debug){ console.log("Username is " + username); }
            let password = Cookies.get("secret");   if (this.debug){ console.log("Password is " + password); }

            if (this.state.logged){ /** Successfuly logged */
                if (this.debug){ console.log("Logged"); }
                return routeTo;
            }
            else if (this.state.logged == false){ /** Not logged */
                if (this.debug){ console.log("Not logged"); }
                return redirectFallback;
            }
            else{
                if (login(username, password)){ /** Data is valid. Trying to loggin. */
                    if (this.debug){ console.log("Cookie data is valid"); }
                    if (this.state.logged == undefined){ /** No response from login */
                        if (this.debug){ console.log("Still Logging"); }
                        return <Route render={() => {
                            return (
                                <div class="pre-loader"></div>
                            );
                        }}/>;
                    }
                }
                else{ /** Data is invalid. Redirecting to fallback. */
                    if (this.debug){ console.log("Cookie data is invalid"); }
                    return redirectFallback;
                }
            }
        }
    }
}

PrivateRoute.propTypes = {
    exact: PropTypes.bool,
    path: PropTypes.string,
    fallback: PropTypes.string,
    userRights: PropTypes.arrayOf(PropTypes.number)
}
PrivateRoute.defaultProps = {
    exact: false,
    path: '/',
    fallback: '/',
    userRights: [worker, moderator, driver, administrator]
}

export default connect(
    state => {
        return {
            logged: state.login != null ,
            rights: state.user != null ? state.user.rangas.id : undefined
        };
    },
    dispatch => {
        return {
            loginAction: (data) => {
                return dispatch(login_user({
                            key: data.accessKey,
                            name: data.username,
                            Vardas: data.Vardas,
                            Pavarde: data.Pavarde,
                            Pareigos: data.Pareigos,
                            PareiguKodas: data.PareiguKodas 
                        }));
            }
        }
    }
)(PrivateRoute);