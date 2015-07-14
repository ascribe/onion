'use strict';

import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired
    },

    render() {
        var availableAcls = ['acl_consign', 'acl_loan', 'acl_transfer', 'acl_view', 'acl_share', 'acl_unshare', 'acl_delete'];

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
