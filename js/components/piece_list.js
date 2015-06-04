import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import AccordionList from './ascribe_accordion_list/accordion_list';
import AccordionListItem from './ascribe_accordion_list/accordion_list_item';
import AccordionListItemTableEditions from './ascribe_accordion_list/accordion_list_item_table_editions';

import Pagination from './ascribe_pagination/pagination';

import PieceListBulkModal from './ascribe_piece_list_bulk_modal/piece_list_bulk_modal';
import PieceListToolbar from './ascribe_piece_list_toolbar/piece_list_toolbar';


let PieceList = React.createClass({
    
    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        let page = this.props.query.page || 1;
        PieceListStore.listen(this.onChange);
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

    accordionChangeOrder(orderBy, orderAsc) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize,
                                        this.state.search, orderBy, orderAsc);
    },

    render() {
        let currentPage = parseInt(this.props.query.page, 10) || 1;
        let totalPages = Math.ceil(this.state.pieceListCount / this.state.pageSize)
        
        return (
            <div>
                <PieceListToolbar className="ascribe-piece-list-toolbar" />
                <PieceListBulkModal className="ascribe-piece-list-bulk-modal" />
                <AccordionList
                    className="ascribe-accordion-list"
                    changeOrder={this.accordionChangeOrder}
                    itemList={this.state.pieceList}
                    orderBy={this.state.orderBy}
                    orderAsc={this.state.orderAsc}
                    search={this.state.search}
                    page={this.state.page}
                    pageSize={this.state.pageSize}>
                    {this.state.pieceList.map((item, i) => {
                        return (
                            <AccordionListItem 
                                className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 ascribe-accordion-list-item"
                                content={item}
                                key={i}>
                                <AccordionListItemTableEditions 
                                    className="ascribe-accordion-list-item-table col-xs-12 col-sm-8 col-md-6 col-lg-6 col-sm-offset-2 col-md-offset-3 col-lg-offset-3"
                                    parentId={item.id}
                                    show={item.show}
                                    numOfEditions={item.num_editions}/>
                            </AccordionListItem>
                        );
                    })}
                </AccordionList>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={this.paginationGoToPage}>
                </Pagination>
            </div>
        );
    }
});

export default PieceList;
