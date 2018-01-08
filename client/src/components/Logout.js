import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout_user } from '../store/actions/loginActions';
import Cookies from 'js-cookie';

class Logout extends React.Component{

    componentDidMount(){
        this.props.logout();
    }
    

    render(){
        Cookies.remove("username");
        Cookies.remove("secret");
        return <Redirect to='/'/>;
    }
}

export default connect(
    null,
    dispatch => {
        return {
            logout: () => {
                return dispatch(logout_user());
            }
        };
    }
)(Logout);