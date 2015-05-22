import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import EditionListStore from '../stores/edition_list_store';
import EditionListActions from '../actions/edition_list_actions';

import Table from './ascribe_table/table';
import TableItem from './ascribe_table/table_item';
import TableItemImg from './ascribe_table/table_item_img';
import TableItemText from './ascribe_table/table_item_text';
import TableItemSubtable from './ascribe_table/table_item_subtable';
import TableItemSubtableButton from './ascribe_table/table_item_subtable_button';

import TableColumnContentModel from '../models/table_column_content_model';

import Pagination from './pagination'


let PieceList = React.createClass({
    
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        let page = this.props.query.page || this.state.page;
        PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);
    },

    paginationGoToPage(page) {
        return () => PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);
    },

    tableChangeOrder(orderBy, orderAsc) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search, orderBy, orderAsc);
    },

    render() {
        let columnList = [
            new TableColumnContentModel('thumbnail', '', TableItemImg, 2, false),
            new TableColumnContentModel('artist_name', 'Artist', TableItemText, 4, true),
            new TableColumnContentModel('title', 'Title', TableItemText, 4, true)
        ];

        // Could wrap this altContainer potentially once again.
        return (
            <AltContainer
                store={PieceListStore}
                transform={(props) => {
                    return {
                        'itemList': props.pieceList,
                        'itemListCount': props.pieceListCount,
                        'orderBy': props.orderBy,
                        'orderAsc': props.orderAsc,
                        'search': props.search,
                        'page': props.page,
                        'pageSize': props.pageSize,
                    }
                }}>
                <Table columnList={columnList} changeOrder={this.tableChangeOrder}>
                    <TableItemSubtable></TableItemSubtable>
                </Table>
                <Pagination currentPage={this.props.query.page} goToPage={this.paginationGoToPage} />
            </AltContainer>
        );
    }
});

export default PieceList;
