'use strict';

import React from 'react';

import TableColumnMixin from '../../mixins/table_column_mixin';
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

    mixins: [TableColumnMixin],

    render() {
        return (
            <thead>
                <tr>
                    {this.props.columnList.map((val, i) => {

                        let columnClasses = this.calcColumnClasses(this.props.columnList, i, 12);
                        let columnName = this.props.columnList[i].columnName;
                        let canBeOrdered = this.props.columnList[i].canBeOrdered;

                        return (
                            <TableHeaderItem
                                key={i}
                                columnClasses={columnClasses}
                                displayName={val.displayName}
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
