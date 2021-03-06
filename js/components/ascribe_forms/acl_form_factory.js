'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';

import ConsignForm from '../ascribe_forms/form_consign';
import UnConsignForm from '../ascribe_forms/form_unconsign';
import TransferForm from '../ascribe_forms/form_transfer';
import LoanForm from '../ascribe_forms/form_loan';
import LoanRequestAnswerForm from '../ascribe_forms/form_loan_request_answer';
import ShareForm from '../ascribe_forms/form_share_email';

import AppConstants from '../../constants/application_constants';
import ApiUrls from '../../constants/api_urls';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getAclFormMessage, getAclFormDataId } from '../../utils/form_utils';
import { getLangText } from '../../utils/lang_utils';


let AclFormFactory = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        acceptName: React.PropTypes.string,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,

        autoFocusProperty: React.PropTypes.string,
        currentUser: React.PropTypes.object,
        email: React.PropTypes.string,
        handleSuccess: React.PropTypes.func,
        message: React.PropTypes.string,
        labels: React.PropTypes.object,
        showNotification: React.PropTypes.bool
    },

    isPiece() {
        return this.props.pieceOrEditions.constructor !== Array;
    },

    getFormDataId() {
        return getAclFormDataId(this.isPiece(), this.props.pieceOrEditions);
    },

    showSuccessNotification(response) {
        if (typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess();
        }

        if (response.notification) {
            const notification = new GlobalNotificationModel(response.notification, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        const { action,
                autoFocusProperty,
                pieceOrEditions,
                currentUser,
                email,
                message,
                labels,
                handleSuccess,
                showNotification } = this.props;
        let acceptButton;

        const formMessage = message || getAclFormMessage({
            aclName: action,
            entities: pieceOrEditions,
            isPiece: this.isPiece(),
            senderName: currentUser && currentUser.username
        });

        if (this.props.acceptName) {
            acceptButton = (
                <div className="modal-footer">
                    <p className="pull-right">
                        <Button
                            className="btn btn-default btn-sm ascribe-margin-1px"
                            type="submit">
                            {getLangText(this.props.acceptName)}
                        </Button>
                    </p>
                </div>
            );
        }

        if (action === 'acl_consign') {
            return (
                <ConsignForm
                    buttons={acceptButton}
                    autoFocusProperty={autoFocusProperty}
                    email={email}
                    message={formMessage}
                    labels={labels}
                    id={this.getFormDataId()}
                    url={ApiUrls.ownership_consigns}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else if (action === 'acl_unconsign') {
            return (
                <UnConsignForm
                    buttons={acceptButton}
                    message={formMessage}
                    id={this.getFormDataId()}
                    url={ApiUrls.ownership_unconsigns}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else if (action === 'acl_transfer') {
            return (
                <TransferForm
                    buttons={acceptButton}
                    message={formMessage}
                    id={this.getFormDataId()}
                    url={ApiUrls.ownership_transfers}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else if (action === 'acl_loan') {
            return (
                <LoanForm
                    buttons={acceptButton}
                    email={email}
                    message={formMessage}
                    id={this.getFormDataId()}
                    url={this.isPiece() ? ApiUrls.ownership_loans_pieces
                                        : ApiUrls.ownership_loans_editions}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else if (action === 'acl_loan_request') {
            return (
                <LoanRequestAnswerForm
                    message={formMessage}
                    id={this.getFormDataId()}
                    url={ApiUrls.ownership_loans_pieces_request_confirm}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else if (action === 'acl_share') {
            return (
                <ShareForm
                    buttons={acceptButton}
                    message={formMessage}
                    id={this.getFormDataId()}
                    url={this.isPiece() ? ApiUrls.ownership_shares_pieces
                                        : ApiUrls.ownership_shares_editions}
                    handleSuccess={showNotification ? this.showSuccessNotification : handleSuccess} />
            );
        } else {
            throw new Error('Your specified action did not match a form.');
        }
    }
});

export default AclFormFactory;
