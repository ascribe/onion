'use strict';

import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        requestAction: React.PropTypes.string
    },

    render() {
        if (this.props.requestAction){
            return (
                <span>
                    {this.props.requestAction + ' request pending'}
                </span>
            );
        }
        var availableAcls = ['acl_consign', 'acl_loan', 'acl_transfer', 'acl_view', 'acl_share', 'acl_unshare'];

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
