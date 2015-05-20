import React from 'react';

/**
 * This could be enhanced further by specifying an optional description for example
 */
let TableItemImg = React.createClass({
    propTypes: {
        content: React.PropTypes.string.isRequired,
    },

    render() {
        return (
            <span>
                <img src={this.props.content} width="50" />
            </span>
        );
    }
});

export default TableItemImg;