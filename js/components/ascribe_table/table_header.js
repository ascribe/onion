import React from 'react';

import TableColumnMixin from '../../mixins/table_column_mixin';
import GeneralUtils from '../../utils/general_utils';
import TableHeaderItem from './table_header_item';


let TableHeader = React.createClass({
    mixins: [TableColumnMixin],
    propTypes: {
        columnMap: React.PropTypes.object.isRequired,
        itemList: React.PropTypes.array.isRequired,
        fetchList: React.PropTypes.func.isRequired,
        orderAsc: React.PropTypes.bool.isRequired,
        orderBy: React.PropTypes.string.isRequired
    },

    render() {

        let columnMapValuesList = GeneralUtils.valuesOfObject(this.props.columnMap);

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-header-row">
                <div className="row">
                    {columnMapValuesList.map((val, i) => {

                        let columnClasses = this.calcColumnClasses(this.props.columnMap, i);
                        let columnName = Object.keys(this.props.columnMap)[i];
                        let canBeOrdered = columnMapValuesList[i].canBeOrdered;

                        return (
                            <TableHeaderItem
                                key={i}
                                columnClasses={columnClasses} 
                                displayName={val.displayName} 
                                columnName={columnName} 
                                canBeOrdered={canBeOrdered} 
                                orderAsc={this.props.orderAsc}
                                orderBy={this.props.orderBy}
                                fetchList={this.props.fetchList}>
                            </TableHeaderItem>
                        );
                    })}
                </div>
            </div> 
        );

    }
});

export default TableHeader;
