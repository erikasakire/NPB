import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.Component{
    render(){
        return <Route 
                    exact={this.props.exact} 
                    path={this.props.path}
                    render={() => {return this.props.logged ? <this.props.component/> : <Redirect to={this.props.fallback}/>}}
                />
        
    }
}

PrivateRoute.propTypes = {
    exact: PropTypes.bool,
    path: PropTypes.string,
    fallback: PropTypes.string
}
PrivateRoute.defaultProps = {
    exact: false,
    path: '/',
    fallback: '/login'
}

export default connect(
    state => {
        return {
            logged: state.login != null 
        };
    },
    null
)(PrivateRoute);