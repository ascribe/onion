'use strict';

import React from 'react';
import Router from 'react-router';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import ContractForm from './ascribe_forms/ikonotv_contract_form';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';


let IkonotvRegisterPiece = React.createClass({

    mixins: [Router.Navigation],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            PieceStore.getState(),
            WhitelabelStore.getState());
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

        if(this.state.currentUser && this.state.currentUser.email) {
            // we should also make the fineuploader component editable again
            this.setState({
                isFineUploaderActive: true
            });
        }
    },

    handleRegisterSuccess(response){

        // once the user was able to register a piece successfully, we need to make sure to keep
        // the piece list up to date
        PieceListActions.fetchPieceList(
            this.state.page,
            this.state.pageSize,
            this.state.searchTerm,
            this.state.orderBy,
            this.state.orderAsc,
            this.state.filterBy
        );

        // also start loading the piece for the next step
        if(response && response.piece) {
            PieceActions.updatePiece(response.piece);
        }

        this.refs.slidesContainer.setSlideNum(1);
    },

    handleAdditionalDataSuccess() {
        this.refs.slidesContainer.setSlideNum(2);
    },

    handleLoanSuccess(response) {
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        PieceActions.fetchOne(this.state.piece.id);
        this.transitionTo('piece', {pieceId: this.state.piece.id});
    },

    changeSlide() {
        // only transition to the login store, if user is not logged in
        // ergo the currentUser object is not properly defined
        if(this.state.currentUser && !this.state.currentUser.email) {
            this.onLoggedOut();
        }
    },

    // basically redirects to the second slide (index: 1), when the user is not logged in
    onLoggedOut() {
        this.transitionTo('login');
    },

    render() {

        return (
            <ContractForm />
        );
    }
});


export default IkonotvRegisterPiece;
