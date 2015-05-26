import React from 'react';
import classNames from 'classnames';

import TableColumnContentModel from '../../models/table_column_content_model';

import TableItem from './table_item';

// This Component is implemented as recommended here: http://stackoverflow.com/a/25723635/1263876
let TableItemSelectable = React.createClass({

    propTypes: {
        parentId: React.PropTypes.number
    },

    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        columnContent: React.PropTypes.object
    },

    render() {
        let tableItemClasses = classNames({
            'ascribe-table-item-selected': this.props.columnContent.selected
        });
        let boundSelectItem = this.props.selectItem.bind(this, this.props.parentId, this.props.columnContent.edition_number);

        return (
            <TableItem classNames={tableItemClasses}
                columnList={this.props.columnList}
                columnContent={this.props.columnContent}
                onClick={boundSelectItem}>
            </TableItem>
        );
    }
});

export default TableItemSelectable;
