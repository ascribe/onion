import React from 'react';

import TableHeaderItemCarret from './table_header_item_carret';

let TableHeaderItem = React.createClass({

    propTypes: {
        columnClasses: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]).isRequired,
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
                    <th 
                        className={'ascribe-table-header-column'}
                        onClick={this.changeOrder}>
                        <span>{this.props.displayName} <TableHeaderItemCarret orderAsc={this.props.orderAsc} /></span>
                    </th>
                );
            } else {
                return (
                    <th 
                        className={'ascribe-table-header-column'}
                        onClick={this.changeOrder}>
                        <span>{this.props.displayName}</span>
                    </th>
                );
            }
        } else {
            return (
                <th className={'ascribe-table-header-column'}>
                    <span>
                        {this.props.displayName}
                    </span>
                </th>
            );
        }
    }
});

export default TableHeaderItem;
