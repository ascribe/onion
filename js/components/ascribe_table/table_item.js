'use strict';

import React from 'react';

import { ColumnModel } from './models/table_models';

import TableItemWrapper from './table_item_wrapper';


let TableItem = React.createClass({

    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    render() {
        return (
            <TableItemWrapper
                onClick={this.props.onClick}
                columnList={this.props.columnList}
                columnContent={this.props.columnContent}
                columnWidth={12} />
        );
    }
});

export default TableItem;
