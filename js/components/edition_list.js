import React from 'react';
import AltContainer from 'alt/AltContainer';

import EditionListStore from '../stores/edition_list_store';
import EditionListActions from '../actions/edition_list_actions';

import Table from './ascribe_table/table';
import TableItemText from './ascribe_table/table_item_text';

import TableColumnModel from '../models/table_column_model';

let EditionList = React.createClass({

    getInitialState() {
        return EditionListStore.getState();
    },

    componentDidMount() {
        EditionListActions.fetchList();
    },

    render() {
        return (
            <AltContainer store={EditionListStore} actions={EditionListActions}>

            </AltContainer>
        );
    }

});

export default EditionList;