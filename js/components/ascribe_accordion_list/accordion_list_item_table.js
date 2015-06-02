import React from 'react';

import Table from '../ascribe_table/table';
import TableItem from '../ascribe_table/table_item';

import TableColumnContentModel from '../../models/table_column_content_model';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemTable = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        parentId: React.PropTypes.number,
        itemList: React.PropTypes.array,
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        numOfTableItems: React.PropTypes.number,
        show: React.PropTypes.bool
    },

    render() {
        if(this.props.show && this.props.itemList) {
            return (
                <div className={this.props.className}>
                    <Table
                      columnList={this.props.columnList} 
                      itemList={this.props.itemList}>
                        {this.props.itemList.map((item, i) => {
                            return (
                                 <TableItem
                                    className="ascribe-table-item-selectable"
                                    key={i}>
                                </TableItem>
                            );
                        })}
                    </Table>
                    {this.props.children}
                </div>
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