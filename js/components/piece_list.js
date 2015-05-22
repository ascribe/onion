import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './ascribe_table/table';
import TableItemImg from './ascribe_table/table_item_img';
import TableItemText from './ascribe_table/table_item_text';

import TableColumnModel from '../models/table_column_model';

import Pagination from './pagination'


let PieceList = React.createClass({
    
    // FIXME: this might be useless
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        let page = this.props.query.page || this.state.page;
        PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search,
                                   this.state.orderBy, this.state.orderAsc);
    },

    render() {
        let columnList = [
            new TableColumnModel('thumbnail', '', TableItemImg, 2, false),
            new TableColumnModel('artist_name', 'Artist', TableItemText, 4, true),
            new TableColumnModel('title', 'Title', TableItemText, 4, true)
        ];

        return (
            <AltContainer 
                store={PieceListStore} 
                actions={PieceListActions}
                transform={(props) => {
                    return {
                        'itemList': props.pieceList,
                        'fetchList': props.fetchPieceList,
                        'orderBy': props.orderBy,
                        'orderAsc': props.orderAsc,
                        'search': props.search,
                        'page': props.page,
                        'pageSize': props.pageSize
                    }
                }}>
                <Table columnList={columnList} />
                <Pagination currentPage={this.props.query.page} />
            </AltContainer>
        );
    }
});

export default PieceList;
