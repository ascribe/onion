'use strict';

import React from 'react';

import PieceActions from '../../../../../../actions/piece_actions';
import PieceStore from '../../../../../../stores/piece_store';

import PieceListActions from '../../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../../stores/piece_list_store';

import UserStore from '../../../../../../stores/user_store';

import Piece from '../../../../../../components/ascribe_detail/piece';

import ListRequestActions from '../../../../../ascribe_forms/list_form_request_actions';
import AclButtonList from '../../../../../ascribe_buttons/acl_button_list';
import DeleteButton from '../../../../../ascribe_buttons/delete_button';

import CollapsibleParagraph from '../../../../../../components/ascribe_collapsible/collapsible_paragraph';

import IkonotvSubmitButton from '../ascribe_buttons/ikonotv_submit_button';

import HistoryIterator from '../../../../../ascribe_detail/history_iterator';

import DetailProperty from '../../../../../ascribe_detail/detail_property';


import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import AclProxy from '../../../../../acl_proxy';

import AppConstants from '../../../../../../constants/application_constants';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let IkonotvPieceContainer = React.createClass({
    getInitialState() {
        return mergeOptions(
            PieceStore.getState(),
            UserStore.getState(),
            PieceListStore.getState()
        );
    },

    componentDidMount() {
        PieceStore.listen(this.onChange);
        PieceActions.fetchOne(this.props.params.pieceId);
        UserStore.listen(this.onChange);
        PieceListStore.listen(this.onChange);
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.params.pieceId !== nextProps.params.pieceId) {
            PieceActions.updatePiece({});
            PieceActions.fetchOne(nextProps.params.pieceId);
        }
    },

    componentWillUnmount() {
        // Every time we're leaving the piece detail page,
        // just reset the piece that is saved in the piece store
        // as it will otherwise display wrong/old data once the user loads
        // the piece detail a second time
        PieceActions.updatePiece({});
        PieceStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    loadPiece() {
        PieceActions.fetchOne(this.props.params.pieceId);
    },

    handleSubmitSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        this.loadPiece();
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getActions(){
        if (this.state.piece &&
            this.state.piece.request_action &&
            this.state.piece.request_action.length > 0) {
            return (
                <ListRequestActions
                    pieceOrEditions={this.state.piece}
                    currentUser={this.state.currentUser}
                    handleSuccess={this.loadPiece}
                    requestActions={this.state.piece.request_action}/>
                );
        }
        else {

            //We need to disable the normal acl_loan because we're inserting a custom acl_loan button
            let availableAcls;

            if(this.state.piece && this.state.piece.acl && typeof this.state.piece.acl.acl_loan !== 'undefined') {
                // make a copy to not have side effects
                availableAcls = mergeOptions({}, this.state.piece.acl);
                availableAcls.acl_loan = false;
            }

            return (
                <AclButtonList
                    className="text-center ascribe-button-list"
                    availableAcls={availableAcls}
                    editions={this.state.piece}
                    handleSuccess={this.loadPiece}>
                        <AclProxy
                            aclObject={availableAcls}
                            aclName="acl_submit">
                            <IkonotvSubmitButton
                                className="btn-sm"
                                handleSuccess={this.handleSubmitSuccess}
                                piece={this.state.piece}/>
                        </AclProxy>
                        <DeleteButton
                            handleSuccess={this.handleDeleteSuccess}
                            piece={this.state.piece}/>
                </AclButtonList>
            );
        }
    },

    render() {
        if('title' in this.state.piece) {
            return (
                <Piece
                    piece={this.state.piece}
                    loadPiece={this.loadPiece}
                    header={
                        <div className="ascribe-detail-header">
                            <hr style={{marginTop: 0}}/>
                            <h1 className="ascribe-detail-title">{this.state.piece.title}</h1>
                            <DetailProperty label="BY" value={this.state.piece.artist_name} />
                            <DetailProperty label="DATE" value={ this.state.piece.date_created.slice(0, 4) } />
                            <hr/>
                        </div>
                        }
                    subheader={
                        <div className="ascribe-detail-header">
                            <DetailProperty label={getLangText('REGISTREE')} value={ this.state.piece.user_registered } />
                            <DetailProperty label={getLangText('ID')} value={ this.state.piece.bitcoin_id } ellipsis={true} />
                            <hr/>
                        </div>
                    }
                    buttons={this.getActions()}>
                    <CollapsibleParagraph
                        title={getLangText('Loan History')}
                        show={this.state.piece.loan_history && this.state.piece.loan_history.length > 0}>
                        <HistoryIterator
                            history={this.state.piece.loan_history} />
                    </CollapsibleParagraph>
                </Piece>
            );
        } else {
            return (
                <div className="fullpage-spinner">
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
    }
});

export default IkonotvPieceContainer;
