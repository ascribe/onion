import React from 'react';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';
import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import AccordionListItemTable from './accordion_list_item_table';
import AccordionListItemTableToggle from './accordion_list_item_table_toggle';

import TableColumnContentModel from '../../models/table_column_content_model';

import TableItemImg from '../ascribe_table/table_item_img';
import TableItemText from '../ascribe_table/table_item_text';
import TableItemCheckbox from '../ascribe_table/table_item_checkbox';
import TableItemAclFiltered from '../ascribe_table/table_item_acl_filtered';

import { getLangText } from '../../utils/lang_utils';

let AccordionListItemTableEditions = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        parentId: React.PropTypes.number,
        numOfEditions: React.PropTypes.number,
        show: React.PropTypes.bool
    },

    getInitialState() {
        return EditionListStore.getState();
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
    },

    componentDidUnmount() {
        EditionListStore.unlisten(this.onChange);
    },

    selectItem(pieceId, editionId) {
        EditionListActions.selectEdition({pieceId, editionId});
    },

    toggleTable() {
        PieceListActions.showEditionList(this.props.parentId);
        EditionListActions.fetchEditionList(this.props.parentId);
    },

    render() {
        let columnList = [
            new TableColumnContentModel((item) => { return { 'editionId': item.id, 'pieceId': this.props.parentId, 'selectItem': this.selectItem, 'selected': item.selected }}, '', '', TableItemCheckbox, 1, false),
            new TableColumnContentModel((item) => { return { 'content': item.edition_number }}, 'num_editions', '#', TableItemText, 1, false),
            new TableColumnContentModel((item) => { return { 'content': item.bitcoin_id }}, 'bitcoin_id', getLangText('Bitcoin Address'), TableItemText, 5, false),
            new TableColumnContentModel((item) => { return { 'content': item.acl }}, 'acl', getLangText('Actions'), TableItemAclFiltered, 4, false)
        ];

        return (
            <div>
                <AccordionListItemTable
                    className={this.props.className}
                    parentId={this.props.parentId}
                    itemList={this.state.editionList[this.props.parentId]}
                    columnList={columnList}
                    numOfTableItems={this.props.numOfEditions}
                    show={this.props.show}>
                    <AccordionListItemTableToggle
                        className="ascribe-accordion-list-table-toggle" 
                        onClick={this.toggleTable}
                        show={this.props.show}
                        numOfTableItems={this.props.numOfEditions} />
                </AccordionListItemTable>
                
            </div>
        );
    }
});

export default AccordionListItemTableEditions;