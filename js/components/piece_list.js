'use strict';

import React from 'react';
import Router from 'react-router';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import AccordionList from './ascribe_accordion_list/accordion_list';
import AccordionListItem from './ascribe_accordion_list/accordion_list_item';
import AccordionListItemTableEditions from './ascribe_accordion_list/accordion_list_item_table_editions';

import Pagination from './ascribe_pagination/pagination';

import PieceListBulkModal from './ascribe_piece_list_bulk_modal/piece_list_bulk_modal';
import PieceListToolbar from './ascribe_piece_list_toolbar/piece_list_toolbar';

import AppConstants from '../constants/application_constants';


let PieceList = React.createClass({
    propTypes: {
        redirectTo: React.PropTypes.string,
        customSubmitButton: React.PropTypes.element
    },

    mixins: [Router.Navigation, Router.State],

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        let page = this.getQuery().page || 1;
        PieceListStore.listen(this.onChange);
        if (this.state.pieceList.length === 0){
            PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search,
                                            this.state.orderBy, this.state.orderAsc, this.state.filterBy)
            .then(PieceListActions.fetchPieceRequestActions());
        }
    },

    componentDidUpdate() {
        if (this.props.redirectTo && this.state.pieceListCount === 0) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => this.transitionTo(this.props.redirectTo), 0);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    paginationGoToPage(page) {
        // if the users clicks a pager of the pagination,
        // the site should go to the top
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        return () => PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search,
                                                    this.state.orderBy, this.state.orderAsc,
                                                    this.state.filterBy);
    },

    getPagination() {
        let currentPage = parseInt(this.getQuery().page, 10) || 1;
        let totalPages = Math.ceil(this.state.pieceListCount / this.state.pageSize);

        if (this.state.pieceListCount > 10) {
            return (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={this.paginationGoToPage} />
            );
        }
    },

    searchFor(searchTerm) {
         PieceListActions.fetchPieceList(1, this.state.pageSize, searchTerm, this.state.orderBy,
                                        this.state.orderAsc, this.state.filterBy);
         this.transitionTo(this.getPathname(), {page: 1});
    },

    applyFilterBy(filterBy) {
        PieceListActions.fetchPieceList(1, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, filterBy);
        // we have to redirect the user always to page one as it could be that there is no page two
        // for filtered pieces
        this.transitionTo(this.getPathname(), {page: 1});
    },

    accordionChangeOrder(orderBy, orderAsc) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        orderBy, orderAsc, this.state.filterBy);
    },

    render() {
        let loadingElement = (<img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />);
        
        return (
            <div>
                <PieceListToolbar
                    className="ascribe-piece-list-toolbar"
                    searchFor={this.searchFor}
                    filterBy={this.state.filterBy}
                    applyFilterBy={this.applyFilterBy}>
                    {this.props.customSubmitButton}
                </PieceListToolbar>
                <PieceListBulkModal className="ascribe-piece-list-bulk-modal" />
                <AccordionList
                    className="ascribe-accordion-list"
                    changeOrder={this.accordionChangeOrder}
                    itemList={this.state.pieceList}
                    count={this.state.pieceListCount}
                    orderBy={this.state.orderBy}
                    orderAsc={this.state.orderAsc}
                    search={this.state.search}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    loadingElement={loadingElement}>
                    {this.state.pieceList.map((piece, i) => {
                        return (
                            <AccordionListItem
                                className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 ascribe-accordion-list-item"
                                content={piece}
                                key={i}>
                                    <AccordionListItemTableEditions
                                        className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2"
                                        parentId={piece.id} />
                            </AccordionListItem>
                        );
                    })}
                </AccordionList>
                {this.getPagination()}
            </div>
        );
    }
});

export default PieceList;
