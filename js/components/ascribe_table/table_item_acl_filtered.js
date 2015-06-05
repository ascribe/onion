'use strict';

import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.array.isRequired
    },

    render() {
        var availableAcls = ['consign', 'loan', 'transfer', 'view'];

        let filteredAcls = this.props.content.filter((v) => {
            return availableAcls.indexOf(v) > -1;
        });

        return (
            <span>
                {filteredAcls.join('/')}
            </span>
        );
    }
});

export default TableItemAclFiltered;
