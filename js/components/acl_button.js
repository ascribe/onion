import React from 'react';

import AppConstants from '../constants/application_constants';

let AclButton = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        availableAcls: React.PropTypes.array.isRequired,
        actionFunction: React.PropTypes.func.isRequired
    },

    actionFunction() {
        this.props.actionFunction(this.props.action);
    },

    render() {
        let shouldDisplay = this.props.availableAcls.indexOf(this.props.action) > -1;
        return (
            <button 
                type="button" 
                className={shouldDisplay ? 'btn btn-default btn-sm' : 'hidden'}
                onClick={this.actionFunction}>
                {this.props.action.toUpperCase()}
            </button>
        );
    }
});

export default AclButton;