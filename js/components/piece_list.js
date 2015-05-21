import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './ascribe_table/table';
import TableItemImg from './ascribe_table/table_item_img';
import TableItemText from './ascribe_table/table_item_text';

import TableColumnModel from '../models/table_column_model';


let PieceList = React.createClass({
    
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListActions.fetchList(this.state.page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);
    },

    render() {

        let columnList = [
            new TableColumnModel('thumbnail', '', TableItemImg, 2, false),
            new TableColumnModel('artist_name', 'Artist', TableItemText, 4, true),
            new TableColumnModel('title', 'Title', TableItemText, 4, true)
        ];

        return (
            <AltContainer store={PieceListStore} actions={PieceListActions}>
                <Table columnList={columnList} />
            </AltContainer>
        );
    }
});

export default PieceList;
