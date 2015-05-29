import React from 'react';
import AltContainer from 'alt/AltContainer';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import AccordionList from './ascribe_accordion_list/accordion_list';
import AccordionListItem from './ascribe_accordion_list/accordion_list_item';

import Pagination from './ascribe_pagination/pagination';

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
            <div class="row">
                <AccordionList
                    className="ascribe-accordion-list row"
                    changeOrder={this.accordionChangeOrder}
                    itemList={this.state.pieceList}
                    itemListCount={this.state.pieceListCount}
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
                                key={i} />
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
