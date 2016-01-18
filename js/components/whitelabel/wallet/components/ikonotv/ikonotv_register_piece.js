'use strict';

import React from 'react';
import Moment from 'moment';
import { History } from 'react-router';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import UserStore from '../../../../../stores/user_store';
import UserActions from '../../../../../actions/user_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';
import LoanForm from '../../../../ascribe_forms/form_loan';

import IkonotvArtistDetailsForm from './ikonotv_forms/ikonotv_artist_details_form';
import IkonotvArtworkDetailsForm from './ikonotv_forms/ikonotv_artwork_details_form';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import ApiUrls from '../../../../../constants/api_urls';

import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let IkonotvRegisterPiece = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        piece: React.PropTypes.object.isRequired,
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            UserStore.getState(),
            PieceListStore.getState(),
            PieceStore.getInitialState(),
            WhitelabelStore.getState(),
            {
                step: 0,
                pageExitWarning: getLangText("If you leave this form now, your work will not be loaned to Ikono TV.")
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        PieceStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();

        const queryParams = this.props.location.query;

        // Since every step of this register process is atomic,
        // we may need to enter the process at step 1 or 2.
        // If this is the case, we'll need the piece number to complete submission.
        // It is encoded in the URL as a queryParam and we're checking for it here.
        //
        // We're using 'in' here as we want to know if 'piece_id' is present in the url,
        // we don't care about the value.
        if ('piece_id' in queryParams) {
            PieceActions.fetchPiece(queryParams.piece_id);
        }
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
        PieceStore.unlisten(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },


    handleRegisterSuccess(response) {
        this.refreshPieceList();

        // Also load the newly registered piece for the next step
        if (response && response.piece) {
            PieceActions.updatePiece(response.piece);
        }

        if (!this.canSubmit()) {
            this.history.push('/collection');
        } else {
            this.nextSlide({ piece_id: response.piece.id });
        }
    },

    handleAdditionalDataSuccess() {
        // We need to refetch the piece again after submitting the additional data
        // since we want it's otherData to be displayed when the user choses to click
        // on the browsers back button.
        PieceActions.fetchPiece(this.state.piece.id);

        this.refreshPieceList();

        this.nextSlide();
    },

    handleLoanSuccess(response) {
        this.setState({ pageExitWarning: null });

        const notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.refreshPieceList();

        this.history.push(`/pieces/${this.state.piece.id}`);
    },

    nextSlide(queryParams) {
        // We need to increase the step to lock the forms that are already filled out
        this.setState({
            step: this.state.step + 1
        });

        this.refs.slidesContainer.nextSlide(queryParams);
    },

    refreshPieceList() {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });
    },

    canSubmit() {
        let currentUser = this.state.currentUser;
        let whitelabel = this.state.whitelabel;
        return currentUser.acl && currentUser.acl.acl_wallet_submit && whitelabel.user;
    },

    getSlideArtistDetails() {
        if (this.canSubmit()) {
            return (
                <div data-slide-title={getLangText('Artist details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <IkonotvArtistDetailsForm
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={this.state.piece} />
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return null;
        }
    },

    getSlideArtworkDetails() {
        if (this.canSubmit()) {
            return (
                <div data-slide-title={getLangText('Artwork details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <IkonotvArtworkDetailsForm
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={this.state.piece} />
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return null;
        }
    },

    getSlideLoan() {
        if (this.canSubmit()) {
            const { piece, whitelabel } = this.state;
            const today = new Moment();
            const endDate = new Moment().add(2, 'years');

            return (
                <div data-slide-title={getLangText('Loan')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <LoanForm
                                loanHeading={getLangText('Loan to IkonoTV archive')}
                                id={{piece_id: piece.id}}
                                url={ApiUrls.ownership_loans_pieces}
                                email={whitelabel.user}
                                startDate={today}
                                endDate={endDate}
                                showStartDate={false}
                                showEndDate={false}
                                gallery="IkonoTV archive"
                                showPersonalMessage={false}
                                createPublicContractAgreement={false}
                                handleSuccess={this.handleLoanSuccess}/>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return null;
        }
    },

    render() {
        const { pageExitWarning } = this.state;

        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                }}
                location={this.props.location}
                pageExitWarning={pageExitWarning}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                disabled={this.state.step > 0}
                                enableLocalHashing={false}
                                headerMessage={getLangText('Register work')}
                                submitMessage={getLangText('Register')}
                                isFineUploaderActive={true}
                                handleSuccess={this.handleRegisterSuccess}
                                location={this.props.location} />
                        </Col>
                    </Row>
                </div>
                {this.getSlideArtworkDetails()}
                {this.getSlideArtistDetails()}
                {this.getSlideLoan()}
            </SlidesContainer>
        );
    }
});

export default IkonotvRegisterPiece;
