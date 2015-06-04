import React from 'react';

import { mergeOptionList } from '../../utils/general_utils';

import EditionListStore from '../../stores/edition_list_store';
import EditionListActions from '../../actions/edition_list_actions';

import UserActions from '../../actions/user_actions';
import UserStore from '../../stores/user_store';

import AclButton from '../acl_button';
import PieceListBulkModalSelectedEditionsWidget from './piece_list_bulk_modal_selected_editions_widget';

let PieceListBulkModal = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },

    getInitialState() {
        return mergeOptionList([EditionListStore.getState(), UserStore.getState()]);
    },

    onChange(state) {
        this.setState(state);
    },

    componentDidMount() {
        EditionListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        EditionListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    fetchSelectedPieceEditionList() {
        let filteredPieceIdList = Object.keys(this.state.editionList)
                                        .filter((pieceId) => {
                                            return this.state.editions.editionList[pieceId]
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

    intersectAcls(a, b) {
        return a.filter((val) => b.indexOf(val) > -1);
    },

    getAvailableAcls() {
        let availableAcls = [];
        let selectedEditionList = this.fetchSelectedEditionList();

        // If no edition has been selected, availableActions is empty
        // If only one edition has been selected, their actions are available
        // If more than one editions have been selected, their acl properties are intersected
        if(selectedEditionList.length >= 1) {
            availableAcls = selectedEditionList[0].acl;
        }
        if(selectedEditionList.length >= 2) {
            for(let i = 1; i < selectedEditionList.length; i++) {
                availableAcls = this.intersectAcls(availableAcls, selectedEditionList[i].acl);
            }
        }
        
        return availableAcls;
    },

    clearAllSelections() {
        EditionListActions.clearAllEditionSelections();
    },

    handleSuccess() {
        this.fetchSelectedPieceEditionList()
            .forEach((pieceId) => {
                EditionListActions.fetchEditionList(pieceId, this.state.orderBy, this.state.orderAsc);
            });

        EditionListActions.clearAllEditionSelections();
    },

    render() {
        let availableAcls = this.getAvailableAcls();
        let selectedEditions = this.fetchSelectedEditionList();

        if(availableAcls.length > 0) {
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
                                        onClick={this.clearAllSelections}>clear all</span>
                                </div>
                            </div>
                            <p></p>
                            <div className="row">
                                <div className="text-center">
                                    <AclButton
                                        availableAcls={availableAcls}
                                        action="transfer"
                                        editions={selectedEditions}
                                        currentUser={this.state.currentUser}
                                        handleSuccess={this.handleSuccess} />
                                    <AclButton
                                        availableAcls={availableAcls}
                                        action="consign"
                                        editions={selectedEditions}
                                        currentUser={this.state.currentUser}
                                        handleSuccess={this.handleSuccess} />
                                    <AclButton
                                        availableAcls={availableAcls}
                                        action="loan"
                                        editions={selectedEditions}
                                        currentUser={this.state.currentUser}
                                        handleSuccess={this.handleSuccess} />
                                    <AclButton
                                        availableAcls={availableAcls}
                                        action="share"
                                        editions={selectedEditions}
                                        currentUser={this.state.currentUser}
                                        handleSuccess={this.handleSuccess} />
                                </div>
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