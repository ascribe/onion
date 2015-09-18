'use strict';

import React from 'react';
import Moment from 'moment';
import Router from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';
import LoanForm from '../../../../ascribe_forms/form_loan';

import IkonotvArtistDetailsForm from './ascribe_forms/ikonotv_artist_details_form';
import IkonotvArtworkDetailsForm from './ascribe_forms/ikonotv_artwork_details_form';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import ApiUrls from '../../../../../constants/api_urls';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';

let IkonotvRegisterPiece = React.createClass({

    propTypes: {
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired
    },

    mixins: [Router.Navigation, Router.State],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            PieceStore.getState(),
            {
                step: 0
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceStore.listen(this.onChange);
        UserActions.fetchCurrentUser();

        let queryParams = this.getQuery();

        // Since every step of this register process is atomic,
        // we may need to enter the process at step 1 or 2.
        // If this is the case, we'll need the piece number to complete submission.
        // It is encoded in the URL as a queryParam and we're checking for it here.
        //
        // We're using 'in' here as we want to know if 'piece_id' is present in the url,
        // we don't care about the value.
        if (queryParams && 'piece_id' in queryParams) {
            PieceActions.fetchOne(queryParams.piece_id);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceStore.unlisten(this.onChange);
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

        this.refreshPieceList();

        // also start loading the piece for the next step
        if(response && response.piece) {
            PieceActions.updatePiece(response.piece);
        }
        if (!this.canSubmit()) {
            this.transitionTo('pieces');
        }
        else {
            this.incrementStep();
            this.refs.slidesContainer.nextSlide();
        }

    },

    handleAdditionalDataSuccess() {

        // We need to refetch the piece again after submitting the additional data
        // since we want it's otherData to be displayed when the user choses to click
        // on the browsers back button.
        PieceActions.fetchOne(this.state.piece.id);

        this.refreshPieceList();

        this.incrementStep();

        this.refs.slidesContainer.nextSlide();
    },

    handleLoanSuccess(response) {
        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.refreshPieceList();

        PieceActions.fetchOne(this.state.piece.id);
        this.transitionTo('piece', {pieceId: this.state.piece.id});
    },

    // We need to increase the step to lock the forms that are already filled out
    incrementStep() {
        // also increase step
        let newStep = this.state.step + 1;
        this.setState({
            step: newStep
        });
    },

    refreshPieceList() {
        PieceListActions.fetchPieceList(
            this.state.page,
            this.state.pageSize,
            this.state.searchTerm,
            this.state.orderBy,
            this.state.orderAsc,
            this.state.filterBy
        );
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

    canSubmit() {
        let currentUser = this.state.currentUser;
        return currentUser && currentUser.acl && currentUser.acl.acl_submit;
    },

    getSlideArtistDetails() {
        if (this.canSubmit()) {
            return (
                <div data-slide-title={getLangText('Artist details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <IkonotvArtistDetailsForm
                                disabled={this.state.step > 1}
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={this.state.piece}/>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    },

    getSlideArtworkDetails() {
        if (this.canSubmit()) {
            return (
                <div data-slide-title={getLangText('Artwork details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <IkonotvArtworkDetailsForm
                                disabled={this.state.step > 1}
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={this.state.piece}/>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    },

    getSlideLoan() {
        if (this.canSubmit()) {

            let today = new Moment();
            let enddate = new Moment();
            enddate.add(1, 'years');
            return (
                <div data-slide-title={getLangText('Loan')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <LoanForm
                                loanHeading={getLangText('Loan to IkonoTV archive')}
                                id={{piece_id: this.state.piece.id}}
                                url={ApiUrls.ownership_loans_pieces}
                                email="submissions@ikono.org"
                                startdate={today}
                                enddate={enddate}
                                gallery="IkonoTV archive"
                                showPersonalMessage={false}
                                createPublicContractAgreement={false}
                                handleSuccess={this.handleLoanSuccess}/>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    },

    render() {
        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                    }}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                disabled={this.state.step > 0}
                                enableLocalHashing={false}
                                headerMessage={getLangText('Register work')}
                                submitMessage={getLangText('Register')}
                                isFineUploaderActive={this.state.isFineUploaderActive}
                                handleSuccess={this.handleRegisterSuccess}
                                onLoggedOut={this.onLoggedOut} />
                        </Col>
                    </Row>
                </div>
                {this.getSlideArtistDetails()}
                {this.getSlideArtworkDetails()}
                {this.getSlideLoan()}
            </SlidesContainer>
        );
    }
});

export default IkonotvRegisterPiece;
