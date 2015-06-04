import React from 'react';

import TableColumnMixin from '../../mixins/table_column_mixin';
import TableHeaderItem from './table_header_item';

import { ColumnModel } from './models/table_models';


let TableHeader = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        itemList: React.PropTypes.array.isRequired,
        changeOrder: React.PropTypes.func,
        orderAsc: React.PropTypes.bool,
        orderBy: React.PropTypes.string
    },

    render() {
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-header-row">
                <div className="row">
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
                                changeOrder={this.props.changeOrder}>
                            </TableHeaderItem>
                        );
                    })}
                </div>
            </div> 
        );

    }
});

export default TableHeader;
