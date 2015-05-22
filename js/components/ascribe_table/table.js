import React from 'react';

import TableHeader from './table_header';
import TableColumnModel from '../../models/table_column_model';


let Table = React.createClass({
    
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnModel)),
        changeOrder: React.PropTypes.func.isRequired,
        tableItem: React.PropTypes.any.isRequired // Optimally, this should check if tableItem is an instance of React.Component or something like that
    },

    render() {
        let TableItem = this.props.tableItem;

        if(this.props.itemList && this.props.itemList.length > 0) {
            return (
                <div className="ascribe-table">
                    <TableHeader columnList={this.props.columnList} itemList={this.props.itemList} fetchList={this.props.fetchList} changeOrder={this.props.changeOrder} orderAsc={this.props.orderAsc} orderBy={this.props.orderBy} />
                    {this.props.itemList.map((item, i) => {
                        return (
                            <TableItem columnList={this.props.columnList} columnContent={item} key={i} />
                        );
                    })}
                </div>
            );

        } else {
            return (
                <p>Loading</p>
            );
        }
    }
});

export default Table;
