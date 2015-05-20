import React from 'react';

/**
 * This could be enhanced further by specifying an optional description for example
 */
let TableItemImg = React.createClass({
    propTypes: {
        src: React.PropTypes.string.isRequired,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    render() {
        return (
            <img src={this.props.src} width={this.props.width} height={this.props.height} />
        );
    }
});

export default TableItemImg;