'use strict';

import React from 'react';

import { ColumnModel } from './models/table_models';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';


import Table from './table';
import TableItemWrapper from './table_item_wrapper';
import TableItemText from './table_item_text';
import TableItemAcl from './table_item_acl';
import TableItemSelectable from './table_item_selectable';
import TableItemSubtableButton from './table_item_subtable_button';


let TableItemSubtable = React.createClass({
    propTypes: {
        columnList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnModel)),
        columnContent: React.PropTypes.object
    },

    getInitialState() {
        return {
            'open': false
        };
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        EditionListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadEditionList() {
        if(this.state.open) {
            this.setState({
                'open': false
            });
        } else {

            EditionListActions.fetchEditionList(this.props.columnContent.id);
            this.setState({
                'open': true,
                'editionList': EditionListStore.getState()
            });
        }
    },

    selectItem(parentId, itemId) {
        EditionListActions.selectEdition({
            'pieceId': parentId,
            'editionId': itemId
        });
    },

    render() {

        let renderEditionListTable = () => {

            let columnList = [
                new ColumnModel('edition_number', 'Number', TableItemText, 2, false),
                new ColumnModel('user_registered', 'User', TableItemText, 4, true),
                new ColumnModel('acl', 'Actions', TableItemAcl, 4, true)
            ];

            if(this.state.open && this.state.editionList[this.props.columnContent.id] && this.state.editionList[this.props.columnContent.id].length) {
                return (
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Table itemList={this.state.editionList[this.props.columnContent.id]} columnList={columnList}>
                            {this.state.editionList[this.props.columnContent.id].map((edition, i) => {
                                return (
                                    <TableItemSelectable
                                        className="ascribe-table-item-selectable"
                                        selectItem={this.selectItem}
                                        parentId={this.props.columnContent.id}
                                        key={i} />
                                );
                            })}
                        </Table>
                      </div>  
                    </div>
                );
            }
        };

        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ascribe-table-item">
                <div className="row">
                    <TableItemWrapper
                        columnList={this.props.columnList}
                        columnContent={this.props.columnContent}
                        columnWidth={12} />
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 ascribe-table-item-column">
                        <TableItemSubtableButton content="+" onClick={this.loadEditionList} />
                    </div>
                </div>
                {renderEditionListTable()}
            </div>
        );
    }
});

export default TableItemSubtable;
