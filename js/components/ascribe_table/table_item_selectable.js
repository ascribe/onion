'use strict';

import React from 'react';
import classNames from 'classnames';

import { ColumnModel } from './models/table_models';

import TableItem from './table_item';

// This component is implemented as recommended here: http://stackoverflow.com/a/25723635/1263876
let TableItemSelectable = React.createClass({

    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object,
        parentId: React.PropTypes.number,
        className: React.PropTypes.string,
        selectItem: React.PropTypes.func
    },

    selectItem() {
        this.props.selectItem(this.props.parentId, this.props.columnContent.id);
    },

    render() {
        let tableItemClasses = classNames({
            'ascribe-table-item-selected': this.props.columnContent.selected
        });

        return (
            <TableItem
                className={tableItemClasses + ' ' + this.props.className}
                columnList={this.props.columnList}
                columnContent={this.props.columnContent}
                onClick={this.selectItem} />
        );
        
    }
});

export default TableItemSelectable;
