import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import Table from './ascribe_table/table';
import TableItem from './ascribe_table/table_item';
import TableItemImg from './ascribe_table/table_item_img';
import TableItemText from './ascribe_table/table_item_text';
import TableItemSubtable from './ascribe_table/table_item_subtable';
import TableItemSubtableButton from './ascribe_table/table_item_subtable_button';

import TableColumnContentModel from '../models/table_column_content_model';

import Pagination from './ascribe_pagination/pagination'


let PieceList = React.createClass({
    
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);

        let page = this.props.query.page || this.state.page;
        PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search, this.state.orderBy, this.state.orderAsc);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    paginationGoToPage(page) {
        return (e) => PieceListActions.fetchPieceList(page, this.state.pageSize,
                                                      this.state.search, this.state.orderBy,
                                                      this.state.orderAsc);
    },

    tableChangeOrder(orderBy, orderAsc) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize,
                                        this.state.search, orderBy, orderAsc);
    },

    render() {
        let columnList = [
            new TableColumnContentModel('thumbnail', '', TableItemImg, 2, false),
            new TableColumnContentModel('artist_name', 'Artist', TableItemText, 4, true),
            new TableColumnContentModel('title', 'Title', TableItemText, 4, true)
        ];

        let currentPage = parseInt(this.props.query.page, 10);
        let totalPages = Math.ceil(this.state.pieceListCount / this.state.pageSize)
        
        if(this.state.pieceList && this.state.pieceList.length > 0) {
            return (
                <div>
                    <Table 
                        columnList={columnList} 
                        changeOrder={this.tableChangeOrder}
                        itemList={this.state.pieceList}
                        itemListCount={this.state.pieceListCount}
                        orderBy={this.state.orderBy}
                        orderAsc={this.state.orderAsc}
                        search={this.state.search}
                        page={this.state.page}
                        pageSize={this.state.pageSize}>
                            {this.state.pieceList.map((item, i) => {
                                return (
                                    <TableItemSubtable
                                        key={i}>
                                    </TableItemSubtable>
                                );
                            })}
                    </Table>
                    <Pagination currentPage={currentPage}
                                totalPages={totalPages}
                                goToPage={this.paginationGoToPage}>
                    </Pagination>
                </div>
            );
        } else {
            return (
                <p>Loading</p>
            );
        }
        
    }
});

export default PieceList;
