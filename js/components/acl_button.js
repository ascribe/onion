import React from 'react';

import AppConstants from '../constants/application_constants';

let AclButton = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        availableAcls: React.PropTypes.array.isRequired
    },

    render() {
        let shouldDisplay = this.props.availableAcls.indexOf(this.props.action) > -1;
        let styles = {};

        if(shouldDisplay) {
            styles.display = 'inline-block';
        } else {
            styles.display = 'none';
        }

        return (
            <button 
                style={styles}
                type="button" 
                className="btn btn-default btn-sm">
                {this.props.action.toUpperCase()}
            </button>
        );
    }
});

export default AclButton;