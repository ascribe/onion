'use strict';

import React from 'react';
import { History } from 'react-router';

import Moment from 'moment';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import LinkContainer from 'react-router-bootstrap/lib/LinkContainer';

import PieceListStore from '../../../../../stores/piece_list_store';
import PieceListActions from '../../../../../actions/piece_list_actions';

import PieceStore from '../../../../../stores/piece_store';
import PieceActions from '../../../../../actions/piece_actions';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import CylandAdditionalDataForm from './cyland_forms/cyland_additional_data_form';

import LoanForm from '../../../../ascribe_forms/form_loan';
import RegisterPieceForm from '../../../../ascribe_forms/form_register_piece';

import SlidesContainer from '../../../../ascribe_slides_container/slides_container';

import ApiUrls from '../../../../../constants/api_urls';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getAclFormMessage } from '../../../../../utils/form_utils';


let CylandRegisterPiece = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState(){
        return mergeOptions(
            PieceListStore.getState(),
            PieceStore.getInitialState(),
            {
                step: 0
            });
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        PieceStore.listen(this.onChange);

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
        PieceStore.unlisten(this.onChange);
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

        this.nextSlide({ piece_id: response.piece.id });
    },

    handleAdditionalDataSuccess() {
        // We need to refetch the piece again after submitting the additional data
        // since we want its otherData to be displayed when the user choses to click
        // on the browsers back button.
        PieceActions.fetchPiece(this.state.piece.id);

        this.refreshPieceList();

        this.nextSlide();
    },

    handleLoanSuccess(response) {
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

    render() {
        const { currentUser, location, whitelabel } = this.props;
        const { piece, step } = this.state;

        const today = new Moment();
        const datetimeWhenWeAllWillBeFlyingCoolHoverboardsAndDinosaursWillLiveAgain = new Moment().add(1000, 'years');

        const loanHeading = getLangText('Loan to Cyland archive');
        const loanButtons = (
            <div>
                <div className='col-xs-6 ascribe-form-btn-container-left'>
                    <button className='btn btn-default btn-wide'>
                        {getLangText('Loan to archive')}
                    </button>
                </div>
                <div className='col-xs-6 ascribe-form-btn-container-right'>
                    <LinkContainer to='/collection'>
                        <button
                            type='button'
                            className='btn btn-secondary btn-wide'>
                            {getLangText('Loan later')}
                        </button>
                    </LinkContainer>
                </div>
            </div>
        );

        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <SlidesContainer
                ref="slidesContainer"
                forwardProcess={true}
                glyphiconClassNames={{
                    pending: 'glyphicon glyphicon-chevron-right',
                    completed: 'glyphicon glyphicon-lock'
                }}
                location={location}>
                <div data-slide-title={getLangText('Register work')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <RegisterPieceForm
                                {...this.props}
                                disabled={step > 0}
                                enableLocalHashing={false}
                                handleSuccess={this.handleRegisterSuccess}
                                headerMessage={getLangText('Submit to Cyland Archive')}
                                isFineUploaderActive={true}
                                submitMessage={getLangText('Submit')} />
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Additional details')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <CylandAdditionalDataForm
                                disabled={step > 1}
                                handleSuccess={this.handleAdditionalDataSuccess}
                                piece={piece} />
                        </Col>
                    </Row>
                </div>
                <div data-slide-title={getLangText('Loan')}>
                    <Row className="no-margin">
                        <Col xs={12} sm={10} md={8} smOffset={1} mdOffset={2}>
                            <LoanForm
                                loanHeading={getLangText('Loan to Cyland archive')}
                                buttons={loanButtons}
                                message={getAclFormMessage({
                                    aclName: 'acl_loan',
                                    entities: piece,
                                    isPiece: true,
                                    senderName: currentUser.username
                                })}
                                id={{piece_id: piece.id}}
                                url={ApiUrls.ownership_loans_pieces}
                                email={whitelabel.user}
                                gallery="Cyland Archive"
                                startDate={today}
                                endDate={datetimeWhenWeAllWillBeFlyingCoolHoverboardsAndDinosaursWillLiveAgain}
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
