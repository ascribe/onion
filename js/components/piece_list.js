import React from 'react';
import withRouter from 'react-router/es6/withRouter';

import PieceListStore from '../stores/piece_list_store';
import PieceListActions from '../actions/piece_list_actions';

import EditionListStore from '../stores/edition_list_store';
import EditionListActions from '../actions/edition_list_actions';

import AccordionList from './ascribe_accordion_list/accordion_list';
import AccordionListItemWallet from './ascribe_accordion_list/accordion_list_item_wallet';
import AccordionListItemTableEditions from './ascribe_accordion_list/accordion_list_item_table_editions';

import AclButtonList from './ascribe_buttons/acl_button_list.js';
import DeleteButton from './ascribe_buttons/delete_button';

import Pagination from './ascribe_pagination/pagination';

import PieceListFilterDisplay from './piece_list_filter_display';

import PieceListBulkModal from './ascribe_piece_list_bulk_modal/piece_list_bulk_modal';
import PieceListToolbar from './ascribe_piece_list_toolbar/piece_list_toolbar';

import AscribeSpinner from './ascribe_spinner';

import { getAvailableAcls } from '../utils/acl_utils';
import { mergeOptions, isShallowEqual } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


const PieceList = React.createClass({
    propTypes: {
        router: React.PropTypes.object.isRequired,

        accordionListItemType: React.PropTypes.func,
        bulkModalButtonListType: React.PropTypes.func,
        canLoadPieceList: React.PropTypes.bool,
        redirectTo: React.PropTypes.shape({
            pathname: React.PropTypes.string,
            query: React.PropTypes.object
        }),
        shouldRedirect: React.PropTypes.func,
        customSubmitButton: React.PropTypes.element,
        customThumbnailPlaceholder: React.PropTypes.func,
        filterParams: React.PropTypes.array,
        orderParams: React.PropTypes.array,
        orderBy: React.PropTypes.string,

        // Provided from AscribeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            accordionListItemType: AccordionListItemWallet,
            bulkModalButtonListType: AclButtonList,
            canLoadPieceList: true,
            filterParams: [{
                label: getLangText('Show works I can'),
                items: [
                    'acl_transfer',
                    'acl_consign',
                    'acl_create_editions'
                ]
            }],
            orderParams: ['artist_name', 'title'],
            redirectTo: {
                pathname: '/register_piece',
                query: null
            },
            shouldRedirect: (pieceCount) => !pieceCount
        };
    },

    getInitialState() {
        const pieceListStore = PieceListStore.getState();
        const stores = mergeOptions(
            pieceListStore,
            EditionListStore.getState(),
            {
                isFilterDirty: false
            }
        );

        // Use the default filters but use the pieceListStore's settings if they're available
        stores.filterBy = Object.assign(this.getDefaultFilterBy(), pieceListStore.filterBy);

        return stores;
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        EditionListStore.listen(this.onChange);

        const page = this.props.location.query.page || 1;
        if (this.props.canLoadPieceList && (this.state.pieceList.length === 0 || this.state.page !== page)) {
            this.loadPieceList({ page });
        }
    },

    componentWillReceiveProps(nextProps) {
        let filterBy;
        let page = this.props.location.query.page || 1;

        // If the user hasn't changed the filter and the new default filter is different
        // than the current filter, apply the new default filter
        if (!this.state.isFilterDirty) {
            const newDefaultFilterBy = this.getDefaultFilterBy(nextProps);

            // Only need to check shallowly since the filterBy shouldn't be nested
            if (!isShallowEqual(this.state.filterBy, newDefaultFilterBy)) {
                filterBy = newDefaultFilterBy;
                page = 1;
            }
        }

        // Only load if we are applying a new filter or if it's the first time we can
        // load the piece list
        if (nextProps.canLoadPieceList && (filterBy || !this.props.canLoadPieceList)) {
            this.loadPieceList({ page, filterBy });
        }
    },

    componentDidUpdate() {
        const { location: { query }, redirectTo, router, shouldRedirect } = this.props;
        const { unfilteredPieceListCount } = this.state;

        if (redirectTo && redirectTo.pathname &&
            (typeof shouldRedirect === 'function' && shouldRedirect(unfilteredPieceListCount))) {
            // FIXME: hack to redirect out of the dispatch cycle
            window.setTimeout(() => router.push({
                // Occasionally, the back end also sets query parameters for Onion.
                // We need to consider this by merging all passed query parameters, as we'll
                // otherwise end up in a 404 screen
                pathname: redirectTo.pathname,
                query: Object.assign({}, query, redirectTo.query)
            }), 0);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        EditionListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getDefaultFilterBy(props = this.props) {
        const { filterParams } = props;
        const defaultFilterBy = {};

        if (filterParams && typeof filterParams.forEach === 'function') {
            filterParams.forEach(({ items }) => {
                items.forEach((item) => {
                    if (typeof item === 'object' && item.defaultValue) {
                        defaultFilterBy[item.key] = true;
                    }
                });
            });
        }

        return defaultFilterBy;
    },

    paginationGoToPage(page) {
        return () => {
            // if the users clicks a pager of the pagination,
            // the site should go to the top
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.loadPieceList({ page });
        };
    },

    getPagination() {
        const currentPage = parseInt(this.props.location.query.page, 10) || 1;
        const totalPages = Math.ceil(this.state.pieceListCount / this.state.pageSize);

        if (this.state.pieceListCount > 20) {
            return (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={this.paginationGoToPage} />
            );
        }
    },

    searchFor(search) {
        const { location: { pathname }, router } = this.props;

        this.loadPieceList({ search, page: 1 });
        router.push({ pathname, query: { page: 1 } });
    },

    applyFilterBy(filterBy) {
        const { location: { pathname }, router } = this.props;

        this.setState({
            isFilterDirty: true
        });

        // first we need to apply the filter on the piece list
        this.loadPieceList({ page: 1, filterBy })
            .then(() => {
                // but also, we need to filter all the open edition lists
                this.state.pieceList
                    .forEach((piece) => {
                        // but only if they're actually open
                        const isEditionListOpenForPiece = this.state.isEditionListOpenForPieceId[piece.id];

                        if (isEditionListOpenForPiece && isEditionListOpenForPiece.show) {
                            EditionListActions.refreshEditionList({
                                pieceId: piece.id,
                                filterBy
                            });
                        }
                    });
            });

        // we have to redirect the user always to page one as it could be that there is no page two
        // for filtered pieces
        router.push({ pathname, query: { page: 1 } });
    },

    applyOrderBy(orderBy) {
        const { filterBy, orderAsc, page, pageSize, search } = this.state;
        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    loadPieceList({ page, filterBy = this.state.filterBy, search = this.state.search }) {
        const { orderAsc, pageSize } = this.state;
        const orderBy = this.state.orderBy || this.props.orderBy;

        return PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    fetchSelectedPieceEditionList() {
        const filteredPieceIdList = Object.keys(this.state.editionList)
                                          .filter((pieceId) => {
                                              return this.state.editionList[pieceId]
                                                         .filter((edition) => edition.selected)
                                                         .length;
                                          });
        return filteredPieceIdList;
    },

    fetchSelectedEditionList() {
        const selectedEditionList = Object.keys(this.state.editionList)
                                          .reduce((selectedList, pieceId) => {
                                              const selectedEditionsForPiece = this.state.editionList[pieceId]
                                                                                   .filter((edition) => edition.selected);
                                              return selectedList.concat(selectedEditionsForPiece);
                                          }, []);

        return selectedEditionList;
    },

    handleAclSuccess() {
        const { filterBy, orderBy, orderAsc, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        this.fetchSelectedPieceEditionList()
            .forEach((pieceId) => {
                EditionListActions.refreshEditionList({ pieceId });
            });
        EditionListActions.clearAllEditionSelections();
    },

    render() {
        const { accordionListItemType: AccordionListItemType,
                bulkModalButtonListType: BulkModalButtonListType,
                currentUser,
                customSubmitButton,
                customThumbnailPlaceholder,
                filterParams,
                orderParams,
                whitelabel } = this.props;

        const loadingElement = <AscribeSpinner color='dark-blue' size='lg'/>;

        const selectedEditions = this.fetchSelectedEditionList();
        const availableAcls = getAvailableAcls(selectedEditions, (aclName) => aclName !== 'acl_view');

        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceListToolbar
                    className="ascribe-piece-list-toolbar"
                    searchFor={this.searchFor}
                    searchQuery={this.state.search}
                    filterParams={filterParams}
                    orderParams={orderParams}
                    filterBy={this.state.filterBy}
                    orderBy={this.state.orderBy}
                    applyFilterBy={this.applyFilterBy}
                    applyOrderBy={this.applyOrderBy}>
                    {customSubmitButton}
                </PieceListToolbar>
                <PieceListBulkModal
                    availableAcls={availableAcls}
                    selectedEditions={selectedEditions}
                    className="ascribe-piece-list-bulk-modal">
                    <BulkModalButtonListType
                        availableAcls={availableAcls}
                        currentUser={currentUser}
                        handleSuccess={this.handleAclSuccess}
                        pieceOrEditions={selectedEditions}
                        whitelabel={whitelabel}
                        className="text-center ascribe-button-list collapse-group">
                        <DeleteButton
                            handleSuccess={this.handleAclSuccess}
                            editions={selectedEditions} />
                    </BulkModalButtonListType>
                </PieceListBulkModal>
                <PieceListFilterDisplay
                    filterBy={this.state.filterBy}
                    filterParams={filterParams} />
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
                    {this.state.pieceList.map((piece) => {
                        return (
                            <AccordionListItemType
                                key={piece.id}
                                className="col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1 col-md-offset-2 col-lg-offset-2 ascribe-accordion-list-item"
                                content={piece}
                                currentUser={currentUser}
                                thumbnailPlaceholder={customThumbnailPlaceholder}
                                whitelabel={whitelabel}>
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

export default withRouter(PieceList);
