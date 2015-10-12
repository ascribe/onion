'use strict';

import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        notifications: React.PropTypes.string
    },

    render() {
        var availableAcls = ['acl_consign', 'acl_loan', 'acl_transfer', 'acl_view', 'acl_share', 'acl_unshare', 'acl_delete'];
        if (this.props.notifications && this.props.notifications.length > 0){
            return (
                <span>
                    {this.props.notifications[0].action_str}
                </span>
            );
        }

        let filteredAcls = Object.keys(this.props.content).filter((key) => {
            return availableAcls.indexOf(key) > -1 && this.props.content[key];
        });

        filteredAcls = filteredAcls.map((acl) => acl.split('acl_')[1]);

        return (
            <span>
                {filteredAcls.join('/')}
            </span>
        );
    }
});

export default TableItemAclFiltered;
