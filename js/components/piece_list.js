'use strict';

import React from 'react';
import { History } from 'react-router';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import EditionListStore from '../stores/edition_list_store';
import EditionListActions from '../actions/edition_list_actions';

import AccordionList from './ascribe_accordion_list/accordion_list';
import AccordionListItemWallet from './ascribe_accordion_list/accordion_list_item_wallet';
import AccordionListItemTableEditions from './ascribe_accordion_list/accordion_list_item_table_editions';

import Pagination from './ascribe_pagination/pagination';

import PieceListFilterDisplay from './piece_list_filter_display';

import PieceListBulkModal from './ascribe_piece_list_bulk_modal/piece_list_bulk_modal';
import PieceListToolbar from './ascribe_piece_list_toolbar/piece_list_toolbar';

import AppConstants from '../constants/application_constants';

import { mergeOptions } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let PieceList = React.createClass({
    propTypes: {
        accordionListItemType: React.PropTypes.func,
        redirectTo: React.PropTypes.string,
        customSubmitButton: React.PropTypes.element,
        filterParams: React.PropTypes.array,
        orderParams: React.PropTypes.array,
        orderBy: React.PropTypes.string,
        location: React.PropTypes.object
    },

    mixins: [History],

    getDefaultProps() {
        return {
            accordionListItemType: AccordionListItemWallet,
            orderParams: ['artist_name', 'title'],
            filterParams: [{
                label: getLangText('Show works I can'),
                items: [
                    'acl_transfer',
                    'acl_consign',
                    'acl_create_editions'
                ]
            }]
        };
    },
    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            EditionListStore.getState()
        );
    },

    componentDidMount() {
        let page = this.props.location.query.page || 1;
        
        PieceListStore.listen(this.onChange);
        EditionListStore.listen(this.onChange);

        let orderBy = this.props.orderBy ? this.props.orderBy : this.state.orderBy;
        if (this.state.pieceList.length === 0 || this.state.page !== page){
            PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search,
                                            orderBy, this.state.orderAsc, this.state.filterBy);
        }
    },

    componentDidUpdate() {
        if (this.props.redirectTo && this.state.unfilteredPieceListCount === 0) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => this.history.pushState(null, this.props.redirectTo, this.props.location.query), 0);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        EditionListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    paginationGoToPage(page) {
        return () => {
            // if the users clicks a pager of the pagination,
            // the site should go to the top
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            PieceListActions.fetchPieceList(page, this.state.pageSize, this.state.search,
                                            this.state.orderBy, this.state.orderAsc,
                                            this.state.filterBy);
        };
    },

    getPagination() {
        let currentPage = parseInt(this.props.location.query.page, 10) || 1;
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
         this.history.pushState(null, this.props.location.pathname, {page: 1});
    },

    applyFilterBy(filterBy){
        // first we need to apply the filter on the piece list
        PieceListActions.fetchPieceList(1, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, filterBy)
                        .then(() => {
                            // but also, we need to filter all the open edition lists
                            this.state.pieceList
                                .forEach((piece) => {
                                    // but only if they're actually open
                                    if(this.state.isEditionListOpenForPieceId[piece.id].show) {
                                        EditionListActions.refreshEditionList({
                                            pieceId: piece.id,
                                            filterBy
                                        });
                                    }

                                });
                        });

        // we have to redirect the user always to page one as it could be that there is no page two
        // for filtered pieces
        this.history.pushState(null, this.props.location.pathname, {page: 1});
    },

    applyOrderBy(orderBy) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        orderBy, this.state.orderAsc, this.state.filterBy);
    },

    render() {
        let loadingElement = (<img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />);
        let AccordionListItemType = this.props.accordionListItemType;

        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceListToolbar
                    className="ascribe-piece-list-toolbar"
                    searchFor={this.searchFor}
                    searchQuery={this.state.search}
                    filterParams={this.props.filterParams}
                    orderParams={this.props.orderParams}
                    filterBy={this.state.filterBy}
                    orderBy={this.state.orderBy}
                    applyFilterBy={this.applyFilterBy}
                    applyOrderBy={this.applyOrderBy}>
                    {this.props.customSubmitButton}
                </PieceListToolbar>
                <PieceListBulkModal className="ascribe-piece-list-bulk-modal" />
                <PieceListFilterDisplay
                    filterBy={this.state.filterBy}
                    filterParams={this.props.filterParams}/>
                <AccordionList
                    className="ascribe-accordion-list"
                    changeOrder={this.accordionChangeOrder}
                    itemList={this.state.pieceList}
                    count={this.state.pieceListCount}
                    orderBy={this.state.orderBy}
                    orderAsc={this.state.orderAsc}
                    search={this.state.search}
                    searchFor={this.searchFor}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    loadingElement={loadingElement}>
                    {this.state.pieceList.map((piece, i) => {
                        return (
                            <AccordionListItemType
                                className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 ascribe-accordion-list-item"
                                content={piece}
                                key={i}>
                                    <AccordionListItemTableEditions
                                        className="ascribe-accordion-list-item-table col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2"
                                        parentId={piece.id} />
                            </AccordionListItemType>
                        );
                    })}
                </AccordionList>
                {this.getPagination()}
            </div>
        );
    }
});

export default PieceList;
