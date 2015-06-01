import React from 'react';

import TableColumnContentModel from '../../models/table_column_content_model';

import TableItemWrapper from './table_item_wrapper';


let TableItem = React.createClass({

    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        columnContent: React.PropTypes.object,
        onClick: React.PropTypes.func, // See: https://facebook.github.io/react/tips/expose-component-functions.html
        className: React.PropTypes.string
    },

    render() {
        return (
            <div className={this.props.className + ' col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-item'}
                onClick={this.props.onClick}>
                <div className="row">
                    <TableItemWrapper
                        columnList={this.props.columnList}
                        columnContent={this.props.columnContent}
                        columnWidth={12}>
                    </TableItemWrapper>
                </div>
            </div> 
        );
    }
});

export default TableItem;
