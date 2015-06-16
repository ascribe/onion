'use strict';

import React from 'react';
import ReactAddons from 'react/addons';

import TableHeader from './table_header';
import { ColumnModel } from './models/table_models';


let Table = React.createClass({
    
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        changeOrder: React.PropTypes.func,
        orderBy: React.PropTypes.string,
        orderAsc: React.PropTypes.bool,
        className: React.PropTypes.string,
        children: React.PropTypes.array,
        itemList: React.PropTypes.array
    },

    renderChildren() {
        return ReactAddons.Children.map(this.props.children, (child, i) => {
            return ReactAddons.addons.cloneWithProps(child, {
                columnList: this.props.columnList,
                columnContent: this.props.itemList[i],
                key: i
            });       
        });
    },
    
    render() {
        return (
            <table className={'table ' + this.props.className}>
                <TableHeader
                    columnList={this.props.columnList}
                    itemList={this.props.itemList}
                    changeOrder={this.props.changeOrder}
                    orderAsc={this.props.orderAsc}
                    orderBy={this.props.orderBy} />
                <tbody>
                    {this.renderChildren()}
                </tbody>
            </table>
        );
    }
});

export default Table;
