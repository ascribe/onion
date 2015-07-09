'use strict';

import React from 'react';


let TableItemCheckbox = React.createClass({
    propTypes: {
        editionId: React.PropTypes.number,
        pieceId: React.PropTypes.number,
        selected: React.PropTypes.bool
    },

    render() {
        return (
            <span>
                <input type="checkbox" checked={this.props.selected} readOnly/>
            </span>
        );
    }
});

export default TableItemCheckbox;
