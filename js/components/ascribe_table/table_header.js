'use strict';

import React from 'react';

import TableHeaderItem from './table_header_item';

import { ColumnModel } from './models/table_models';


let TableHeader = React.createClass({
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        itemList: React.PropTypes.array.isRequired,
        changeOrder: React.PropTypes.func,
        orderAsc: React.PropTypes.bool,
        orderBy: React.PropTypes.string
    },

    render() {
        return (
            <thead>
                <tr>
                    {this.props.columnList.map((column, i) => {

                        let columnName = column.columnName;
                        let canBeOrdered = column.canBeOrdered;

                        return (
                            <TableHeaderItem
                                className={column.className}
                                key={i}
                                displayName={column.displayName}
                                columnName={columnName}
                                canBeOrdered={canBeOrdered}
                                orderAsc={this.props.orderAsc}
                                orderBy={this.props.orderBy}
                                changeOrder={this.props.changeOrder} />
                        );
                    })}
                </tr>
            </thead>
        );
    }
});

export default TableHeader;
