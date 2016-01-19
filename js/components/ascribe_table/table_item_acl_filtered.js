'use strict';

import React from 'react';


const TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        notifications: React.PropTypes.array
    },

    render() {
        const availableAcls = ['acl_consign', 'acl_loan', 'acl_transfer', 'acl_view', 'acl_share', 'acl_unshare', 'acl_delete'];
        if (this.props.notifications && this.props.notifications.length) {
            return (
                <span>
                    {this.props.notifications[0].action_str}
                </span>
            );
        }

        const filteredAcls = Object.keys(this.props.content)
            .filter((key) => availableAcls.indexOf(key) > -1 && this.props.content[key])
            .map((acl) => acl.split('acl_')[1])
            .join('/');

        return (
            <span>
                {filteredAcls}
            </span>
        );
    }
});

export default TableItemAclFiltered;
