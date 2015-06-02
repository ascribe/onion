import React from 'react';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import AccordionListItemTable from './accordion_list_item_table';

import TableColumnContentModel from '../../models/table_column_content_model';

import TableItemImg from '../ascribe_table/table_item_img';
import TableItemText from '../ascribe_table/table_item_text';
import TableItemCheckbox from '../ascribe_table/table_item_checkbox';
import TableItemAclFiltered from '../ascribe_table/table_item_acl_filtered';

import getLangText from '../../utils/lang_utils';

let AccordionListItemTableEditions = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        parentId: React.PropTypes.number,
        numOfEditions: React.PropTypes.number
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

    getEditionList() {
        EditionListActions.fetchEditionList(this.props.parentId);
    },

    selectItem(pieceId, editionId) {
        EditionListActions.selectEdition({pieceId, editionId});
    },

    render() {
        let columnList = [
            new TableColumnContentModel((item) => { return { 'editionId': item.id, 'pieceId': this.props.parentId, 'selectItem': this.selectItem, 'selected': item.selected }}, '', '', TableItemCheckbox, 1, false),
            new TableColumnContentModel((item) => { return { 'content': item.edition_number }}, 'num_editions', '#', TableItemText, 1, false),
            new TableColumnContentModel((item) => { return { 'content': item.bitcoin_id }}, 'bitcoin_id', getLangText('Bitcoin Address'), TableItemText, 5, false),
            new TableColumnContentModel((item) => { return { 'content': item.acl }}, 'acl', getLangText('Actions'), TableItemAclFiltered, 4, false)
        ];

        return (
            <AccordionListItemTable
                className={this.props.className}
                parentId={this.props.parentId}
                fetchData={this.getEditionList}
                itemList={this.state.editionList[this.props.parentId]}
                columnList={columnList}
                numOfTableItems={this.props.numOfEditions} />
        );
    }
});

export default AccordionListItemTableEditions;