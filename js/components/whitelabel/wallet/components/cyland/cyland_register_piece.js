'use strict';

import React from 'react';
import { History } from 'react-router';

import Moment from 'moment';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import CylandAdditionalDataForm from './ascribe_forms/cyland_additional_data_form';

import LoanForm from '../../../../ascribe_forms/form_loan';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import ApiUrls from '../../../../../constants/api_urls';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getAclFormMessage } from '../../../../../utils/form_utils';


let CylandRegisterPiece = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            PieceStore.getState(),
            WhitelabelStore.getState(),
            {
                selectedLicense: 0,
                isFineUploaderActive: false,
                step: 0
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();

        let queryParams = this.props.location.query;

        // Since every step of this register process is atomic,
        // we may need to enter the process at step 1 or 2.
        // If this is the case, we'll need the piece number to complete submission.
        // It is encoded in the URL as a queryParam and we're checking for it here.
        //
        // We're using 'in' here as we want to know if 'piece_id' is present in the url,
        // we don't care about the value.
        if(queryParams && 'piece_id' in queryParams) {
            PieceActions.fetchOne(queryParams.piece_id);
        }
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

        this.refreshPieceList();

        // also start loading the piece for the next step
        if(response && response.piece) {
            PieceActions.updatePiece(response.piece);
        }

        this.incrementStep();

        this.refs.slidesContainer.nextSlide();
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

        this.history.pushState(null, `/pieces/${this.state.piece.id}`);
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
        this.history.pushState(null, '/login');
    },

    render() {

        let today = new Moment();
        let datetimeWhenWeAllWillBeFlyingCoolHoverboardsAndDinosaursWillLiveAgain = new Moment();
        datetimeWhenWeAllWillBeFlyingCoolHoverboardsAndDinosaursWillLiveAgain.add(1000, 'years');

        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                }}
                location={this.props.location}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                disabled={this.state.step > 0}
                                enableLocalHashing={false}
                                headerMessage={getLangText('Submit to Cyland Archive')}
                                submitMessage={getLangText('Submit')}
                                isFineUploaderActive={this.state.isFineUploaderActive}
                                handleSuccess={this.handleRegisterSuccess}
                                onLoggedOut={this.onLoggedOut}
                                location={this.props.location}/>
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Additional details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <CylandAdditionalDataForm
                                disabled={this.state.step > 1}
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={this.state.piece}
                                location={this.props.location}/>
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Loan')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <LoanForm
                                loanHeading={getLangText('Loan to Cyland archive')}
                                message={getAclFormMessage('acl_loan', '\"' + this.state.piece.title + '\"', this.state.currentUser.username)}
                                id={{piece_id: this.state.piece.id}}
                                url={ApiUrls.ownership_loans_pieces}
                                email={this.state.whitelabel.user}
                                gallery="Cyland Archive"
                                startdate={today}
                                enddate={datetimeWhenWeAllWillBeFlyingCoolHoverboardsAndDinosaursWillLiveAgain}
                                showStartDate={false}
                                showEndDate={false}
                                showPersonalMessage={false}
                                handleSuccess={this.handleLoanSuccess} />
                        </Col>
                    </Row>
                </div>
            </SlidesContainer>
        );
    }
});

export default CylandRegisterPiece;
