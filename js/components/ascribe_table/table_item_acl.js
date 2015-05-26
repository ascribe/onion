import React from 'react';


let TableItemAcl = React.createClass({
    propTypes: {
        content: React.PropTypes.array.isRequired
    },

    render() {
        return (
            <span>
                {this.props.content.join('/')}
            </span>
        );
    }
});

export default TableItemAcl;
