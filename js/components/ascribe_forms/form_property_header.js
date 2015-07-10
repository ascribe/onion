'use strict';

import React from 'react';

let FormPropertyHeader = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        return (
            <div className="ascribe-form-header">
                {this.props.children}
            </div>
        );
    }
});

export default FormPropertyHeader;