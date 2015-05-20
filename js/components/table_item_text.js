import React from 'react';

let TableItemText = React.createClass({
    propTypes: {
        content: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <span>
                {this.props.content}
            </span>
        );
    }
});

export default TableItemText;