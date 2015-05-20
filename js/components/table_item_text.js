import React from 'react';

let TableItemText = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <span>
                {this.props.text}
            </span>
        );
    }
});

export default TableItemText;