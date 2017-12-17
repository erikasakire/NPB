import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout_user } from '../store/actions/loginActions';

class Logout extends React.Component{

    componentDidMount(){
        this.props.logout();
    }
    

    render(){
        return <Redirect to='/login'/>;
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