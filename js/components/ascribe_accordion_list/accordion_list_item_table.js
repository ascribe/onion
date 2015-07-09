'use strict';

import React from 'react';

import Table from '../ascribe_table/table';
import TableItemSelectable from '../ascribe_table/table_item_selectable';

import { ColumnModel } from '../ascribe_table/models/table_models';

let AccordionListItemTable = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        parentId: React.PropTypes.number,
        itemList: React.PropTypes.array,
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        show: React.PropTypes.bool,
        changeOrder: React.PropTypes.func,
        orderBy: React.PropTypes.string,
        orderAsc: React.PropTypes.bool,
        selectItem: React.PropTypes.func
    },

    render() {
        if(this.props.show && this.props.itemList) {
            return (
                <Table
                    responsive
                    className="ascribe-table"
                    columnList={this.props.columnList}
                    itemList={this.props.itemList}
                    changeOrder={this.props.changeOrder}
                    orderBy={this.props.orderBy}
                    orderAsc={this.props.orderAsc}>
                    {this.props.itemList.map((item, i) => {
                        return (
                             <TableItemSelectable
                                className="ascribe-table-item-selectable"
                                key={i}
                                selectItem={this.props.selectItem}
                                parentId={this.props.parentId}/>
                        );
                    })}
                </Table>
            );
        } else {
            return (
                <div className={this.props.className}>
                    {this.props.children}
                </div>
            );
        }
    }
});

export default AccordionListItemTable;