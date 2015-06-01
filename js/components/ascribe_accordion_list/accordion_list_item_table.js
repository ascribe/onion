import React from 'react';

import Table from '../ascribe_table/table';
import TableItemSelectable from '../ascribe_table/table_item_selectable';

import TableColumnContentModel from '../../models/table_column_content_model';

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
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TableColumnContentModel))
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
                                 <TableItemSelectable
                                    className="ascribe-table-item-selectable"
                                    key={i}>
                                </TableItemSelectable>
                            );
                        })}
                    </Table>
                    <AccordionListItemTableToggle
                        className="ascribe-accordion-list-table-toggle" 
                        onClick={this.toggleTable} />
                </div>
            );
        } else {
            return (
                <div className={this.props.className}>
                    <AccordionListItemTableToggle
                        className="ascribe-accordion-list-table-toggle" 
                        onClick={this.toggleTable} />
                </div>
            );
        }
    }
});

let AccordionListItemTableToggle = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    render() {
        return (
            <span 
                className={this.props.className}
                onClick={this.props.onClick}>Show all X Editions</span>
        );
    }
});

export default AccordionListItemTable;