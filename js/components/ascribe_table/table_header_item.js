import React from 'react';

import TableHeaderItemCarret from './table_header_item_carret';

let TableHeaderItem = React.createClass({

    propTypes: {
        columnClasses: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        columnName: React.PropTypes.string.isRequired,
        canBeOrdered: React.PropTypes.bool,
        changeOrder: React.PropTypes.func,
        orderAsc: React.PropTypes.bool,
        orderBy: React.PropTypes.string
    },

    changeOrder() {
        this.props.changeOrder(this.props.columnName, !this.props.orderAsc);
    },

    render() {
        if(this.props.canBeOrdered && this.props.changeOrder && this.props.orderAsc != null && this.props.orderBy) {
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
