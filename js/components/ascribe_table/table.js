import React from 'react';
import ReactAddons from 'react/addons';

import TableHeader from './table_header';
import TableColumnContentModel from '../../models/table_column_content_model';


let Table = React.createClass({
    
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        changeOrder: React.PropTypes.func // turn isRequired on again after editions order implemented
    },

    renderChildren() {
        var that = this;
        return ReactAddons.Children.map(this.props.children, (child) => {
            return that.props.itemList.map((item, i) => {
                 return ReactAddons.addons.cloneWithProps(child, {
                    columnList: this.props.columnList,
                    columnContent: item,
                    key: i
                });
            });           
        });
    },

    render() {
        
        if(this.props.itemList && this.props.itemList.length > 0) {
            return (
                <div className="ascribe-table">
                    <TableHeader columnList={this.props.columnList} itemList={this.props.itemList} fetchList={this.props.fetchList} changeOrder={this.props.changeOrder} orderAsc={this.props.orderAsc} orderBy={this.props.orderBy} />
                    {this.renderChildren()}
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
