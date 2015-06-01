import React from 'react';
import ReactAddons from 'react/addons';

import TableHeader from './table_header';
import TableColumnContentModel from '../../models/table_column_content_model';


let Table = React.createClass({
    
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        changeOrder: React.PropTypes.func
    },

    renderChildren() {
        var that = this;
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
            <div className="ascribe-table">
                <TableHeader 
                    columnList={this.props.columnList} 
                    itemList={this.props.itemList} 
                    fetchList={this.props.fetchList} 
                    changeOrder={this.props.changeOrder} 
                    orderAsc={this.props.orderAsc} 
                    orderBy={this.props.orderBy} />
                <div className="row">
                    {this.renderChildren()}
                </div>
            </div>
        );
    }
});

export default Table;
