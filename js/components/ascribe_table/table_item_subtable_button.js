'use strict';

import React from 'react';

let TableItemSubtableButton = React.createClass({
    
    propTypes: {
        content: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <span>
                <button type="button" className="btn btn-default btn-sm ascribe-table-expand-button" onClick={this.props.onClick}>
                    {this.props.content}
                </button>
            </span>
        );
    }
});

export default TableItemSubtableButton;