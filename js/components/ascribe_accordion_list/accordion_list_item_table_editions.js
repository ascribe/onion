import React from 'react';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import AccordionListItemTable from './accordion_list_item_table';

import TableColumnContentModel from '../../models/table_column_content_model';

import TableItemImg from '../ascribe_table/table_item_img';
import TableItemText from '../ascribe_table/table_item_text';
import TableItemAclFiltered from '../ascribe_table/table_item_acl_filtered';

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

    render() {

        let columnList = [
            new TableColumnContentModel('edition_number', 'Nr', TableItemText, 1, false),
            new TableColumnContentModel('bitcoin_id', 'Bitcoin Address', TableItemText, 5, false),
            new TableColumnContentModel('acl', 'Actions', TableItemAclFiltered, 6, false)
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