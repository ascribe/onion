import React from 'react';

import Table from '../ascribe_table/table';
import TableItem from '../ascribe_table/table_item';

import TableColumnContentModel from '../../models/table_column_content_model';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemTable = React.createClass({
    getInitialState() {
        return {
            'show': false
        };
    },

    propTypes: {
        className: React.PropTypes.string,
        parentId: React.PropTypes.number,
        fetchData: React.PropTypes.func,
        itemList: React.PropTypes.array,
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel)),
        numOfTableItems: React.PropTypes.number
    },

    toggleTable() {
        this.props.fetchData();
        this.setState({
            'show': !this.state.show
        });
    },

    render() {
        if(this.props.itemList && this.state.show) {
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
                    <AccordionListItemTableToggle
                        className="ascribe-accordion-list-table-toggle" 
                        onClick={this.toggleTable}
                        show={this.state.show}
                        numOfTableItems={this.props.numOfTableItems} />
                </div>
            );
        } else {
            return (
                <div className={this.props.className}>
                    <AccordionListItemTableToggle
                        className="ascribe-accordion-list-table-toggle" 
                        onClick={this.toggleTable} 
                        show={this.state.show}
                        numOfTableItems={this.props.numOfTableItems} />
                </div>
            );
        }
    }
});

let AccordionListItemTableToggle = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        onClick: React.PropTypes.func,
        show: React.PropTypes.bool,
        numOfTableItems: React.PropTypes.number
    },

    render() {
        let messageShow = this.props.numOfTableItems == 1 ?
                  getLangText('Show the edition') :
                  getLangText('Show all %d Editions', this.props.numOfTableItems)
        return (
            <span 
                className={this.props.className}
                onClick={this.props.onClick}>
                {this.props.show ? getLangText('Hide') : messageShow}
            </span>
        );
    }
});

export default AccordionListItemTable;