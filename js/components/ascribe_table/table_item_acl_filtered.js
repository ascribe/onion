import React from 'react';


let TableItemAclFiltered = React.createClass({
    propTypes: {
        content: React.PropTypes.array.isRequired
    },

    render() {
        let filteredAcls = this.props.content.filter((v) => {
            return v === 'consign' || v === 'loan' || v === 'transfer' || v === 'view';
        });

        return (
            <span>
                {filteredAcls.join('/')}
            </span>
        );
    }
});

export default TableItemAclFiltered;
