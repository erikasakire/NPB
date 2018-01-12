import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { worker, moderator, administrator, driver } from './Rights';

class PrivateLink extends React.Component{
    render(){
        /** If user is not logged he can't see links */
        if (!this.props.logged){
            return null;
        }
        /** If user dont have rights, dont show him links */
        if (this.props.rights == undefined){
            return null;
        }

        /** If user is not authorized */
        if (this.props.userRights.indexOf(parseInt(this.props.rights)) == -1){
            return null;
        }

        return <Link to={this.props.to} className={this.props.className}>{this.props.children}</Link>;

    }
}

PrivateLink.propTypes = {
    to: PropTypes.string.isRequired,
    userRights: PropTypes.arrayOf(PropTypes.number).isRequired
};
PrivateLink.defaultProps = {
    userRights: [worker, moderator, administrator, driver]
};

export default connect(
    state => {
        return {
            logged: state.login != null,
            rights: state.user != null ? state.user.rangas.id : undefined
        };
    }
)(PrivateLink);