'use strict';

import React from 'react';


let TableItemText = React.createClass({
    propTypes: {
        content: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]) 
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
