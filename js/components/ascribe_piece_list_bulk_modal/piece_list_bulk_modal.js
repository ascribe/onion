'use strict';

import React from 'react';

import { mergeOptions } from '../../utils/general_utils';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import PieceListStore from '../../stores/piece_list_store';
import PieceListActions from '../../actions/piece_list_actions';

import PieceListBulkModalSelectedEditionsWidget from './piece_list_bulk_modal_selected_editions_widget';
import AclButtonList from '../ascribe_buttons/acl_button_list';
import DeleteButton from '../ascribe_buttons/delete_button';

import { getAvailableAcls } from '../../utils/acl_utils';
import { getLangText } from '../../utils/lang_utils.js';

let PieceListBulkModal = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },

    getInitialState() {
        return mergeOptions(
            EditionListStore.getState(),
            UserStore.getState(),
            PieceListStore.getState()
        );
    },

    

    componentDidMount() {
        EditionListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);
    },

    componentWillUnmount() {
        EditionListStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    fetchSelectedPieceEditionList() {
        let filteredPieceIdList = Object.keys(this.state.editionList)
                                        .filter((pieceId) => {
                                            return this.state.editionList[pieceId]
                                                .filter((edition) => edition.selected).length > 0;
                                        });
        return filteredPieceIdList;
    },

    fetchSelectedEditionList() {
        let selectedEditionList = [];

        Object
            .keys(this.state.editionList)
            .forEach((pieceId) => {
                let filteredEditionsForPiece = this.state.editionList[pieceId].filter((edition) => edition.selected);
                selectedEditionList = selectedEditionList.concat(filteredEditionsForPiece);
            });

        return selectedEditionList;
    },

    clearAllSelections() {
        EditionListActions.clearAllEditionSelections();
        EditionListActions.closeAllEditionLists();
    },

    handleSuccess() {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        this.fetchSelectedPieceEditionList()
            .forEach((pieceId) => {
                EditionListActions.refreshEditionList({pieceId, filterBy: {}});
            });
        EditionListActions.clearAllEditionSelections();
    },

    render() {
        let selectedEditions = this.fetchSelectedEditionList();
        let availableAcls = getAvailableAcls(selectedEditions, (aclName) => aclName !== 'acl_view');

        if(Object.keys(availableAcls).length > 0) {
            return (
                <div className={this.props.className}>
                    <div className="row no-margin">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 piece-list-bulk-modal">
                            <p></p>
                            <div className="row">
                                <div className="text-center">
                                    <PieceListBulkModalSelectedEditionsWidget
                                        numberOfSelectedEditions={this.fetchSelectedEditionList().length} />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span
                                        className="piece-list-bulk-modal-clear-all"
                                        onClick={this.clearAllSelections}>{getLangText('clear all')}</span>
                                </div>
                            </div>
                            <p></p>
                            <div className="row-fluid">
                                <AclButtonList
                                    availableAcls={availableAcls}
                                    editions={selectedEditions}
                                    handleSuccess={this.handleSuccess}
                                    className="text-center ascribe-button-list collapse-group">
                                    <DeleteButton
                                        handleSuccess={this.handleSuccess}
                                        editions={selectedEditions}/>
                                </AclButtonList>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
        
    }
});

export default PieceListBulkModal;