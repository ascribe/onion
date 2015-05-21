import React from 'react';

import TableHeaderItemCarret from './table_header_item_carret';

let TableHeaderItem = React.createClass({

    propTypes: {
        columnClasses: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        columnName: React.PropTypes.string.isRequired,
        canBeOrdered: React.PropTypes.bool.isRequired,
        orderAsc: React.PropTypes.bool.isRequired,
        orderBy: React.PropTypes.string.isRequired,
        fetchList: React.PropTypes.func.isRequired
    },

    changeOrder() {
        this.props.fetchList(1, 10, null, this.props.columnName, !this.props.orderAsc);
    },

    render() {
        if(this.props.canBeOrdered) {
            if(this.props.columnName === this.props.orderBy) {
                return (
                    <div 
                        className={this.props.columnClasses + ' ascribe-table-header-column'}
                        onClick={this.changeOrder}>
                        <span>{this.props.displayName} <TableHeaderItemCarret orderAsc={this.props.orderAsc} /></span>
                    </div>
                );
            } else {
                return (
                    <div 
                        className={this.props.columnClasses + ' ascribe-table-header-column'}
                        onClick={this.changeOrder}>
                        <span>{this.props.displayName}</span>
                    </div>
                );
            }
        } else {
            return (
                <div className={this.props.columnClasses + ' ascribe-table-header-column'}>
                    <span>
                        {this.props.displayName}
                    </span>
                </div>
            );
        }
    }
});

export default TableHeaderItem;
