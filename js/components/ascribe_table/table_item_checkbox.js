'use strict';

import React from 'react';


let TableItemCheckbox = React.createClass({
    propTypes: {
        editionId: React.PropTypes.number,
        pieceId: React.PropTypes.number,
        selectItem: React.PropTypes.func,
        selected: React.PropTypes.bool
    },

    selectItem() {
        this.props.selectItem(this.props.pieceId, this.props.editionId);
    },

    render() {
        return (
            <span>
                <input type="checkbox" onChange={this.selectItem} checked={this.props.selected}/>
            </span>
        );
    }
});

export default TableItemCheckbox;
