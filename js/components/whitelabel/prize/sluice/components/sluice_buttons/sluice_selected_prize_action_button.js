'use strict'

import React from 'react';
import Moment from 'moment';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import LoanForm from '../../../../../ascribe_forms/form_loan';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import ApiUrls from '../../../../../../constants/api_urls';

import { getLangText } from '../../../../../../utils/lang_utils';

const SluiceSelectedPrizeActionButton = React.createClass({
    propTypes: {
        piece: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        startLoanDate: React.PropTypes.object,
        endLoanDate: React.PropTypes.object,
        className: React.PropTypes.string,
        handleSuccess: React.PropTypes.func
    },

    handleSuccess(res) {
        const notification = new GlobalNotificationModel(res && res.notification || getLangText('You have successfully requested the loan, pending their confirmation.'), 'success', 4000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        if (typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess(res);
        }
    },

    render() {
        const { currentUser, piece } = this.props;

        // Can't use default props since those are only created once
        const startLoanDate = this.props.startLoanDate || new Moment();
        const endLoanDate = this.props.endLoanDate || new Moment().add(6, 'months');

        return (
            <ModalWrapper
                trigger={
                    <button className='btn btn-default btn-sm'>
                        {getLangText('SEND LOAN REQUEST')}
                    </button>
                }
                handleSuccess={this.handleSuccess}
                title={getLangText('REQUEST LOAN')}>
                    <LoanForm
                        loanHeading={null}
                        message={getLangText('Congratulations,\nYou have been selected for the prize.\n' +
                                             'Please accept the loan request to proceed.')}
                        id={{ piece_id: piece.id }}
                        url={ApiUrls.ownership_loans_pieces_request}
                        email={currentUser.email}
                        gallery={piece.prize.name}
                        startDate={startLoanDate}
                        endDate={endLoanDate}
                        showPersonalMessage={true}
                        showPassword={false} />
            </ModalWrapper>
        );
    }
});

export default SluiceSelectedPrizeActionButton;

