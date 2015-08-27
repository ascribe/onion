'use strict';

import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        requestAction: React.PropTypes.string
    },

    render() {
        var availableAcls = ['acl_consign', 'acl_loan', 'acl_transfer', 'acl_view', 'acl_share', 'acl_unshare', 'acl_delete'];
        if (this.props.requestAction && this.props.requestAction.length > 0){
            return (
                <span>
                    {this.props.requestAction[0].action + ' request pending'}
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
