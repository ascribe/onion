'use strict';

import React from 'react';

import TableHeaderItemCarret from './table_header_item_carret';

let TableHeaderItem = React.createClass({

    propTypes: {
        displayElement: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]).isRequired,
        columnName: React.PropTypes.string.isRequired,
        canBeOrdered: React.PropTypes.bool,
        changeOrder: React.PropTypes.func,
        orderAsc: React.PropTypes.bool,
        orderBy: React.PropTypes.string,
        className: React.PropTypes.string
    },

    changeOrder() {
        this.props.changeOrder(this.props.columnName, !this.props.orderAsc);
    },

    render() {
        const { canBeOrdered, changeOrder, className, columnName, displayElement, orderAsc, orderBy } = this.props;

        if (canBeOrdered && changeOrder && orderAsc != null && orderBy) {
            if (columnName === orderBy) {
                return (
                    <th
                        className={'ascribe-table-header-column ' + className}
                        onClick={this.changeOrder}>
                        <span>{displayElement} <TableHeaderItemCarret orderAsc={orderAsc} /></span>
                    </th>
                );
            } else {
                return (
                    <th
                        className={'ascribe-table-header-column ' + className}
                        onClick={this.changeOrder}>
                        <span>{displayElement}</span>
                    </th>
                );
            }
        } else {
            return (
                <th className={'ascribe-table-header-column ' + className}>
                    <span>
                        {displayElement}
                    </span>
                </th>
            );
        }
    }
});

export default TableHeaderItem;
