'use strict';

import React from 'react';

import Form from './form';

import LoanRequestButton from '../ascribe_buttons/acls/loan_request_button';
import UnconsignButton from '../ascribe_buttons/acls/unconsign_button';

import ActionPanel from '../ascribe_panel/action_panel';

import NotificationActions from '../../actions/notification_actions';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getAclFormDataId } from '../../utils/form';
import { getLangText } from '../../utils/lang.js';
import { resolveUrl } from '../../utils/url_resolver';

let RequestActionForm = React.createClass({
    propTypes: {
        notifications: React.PropTypes.object.isRequired,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,

        handleSuccess: React.PropTypes.func
    },

    isPiece() {
        return this.props.pieceOrEditions.constructor !== Array;
    },

    getUrls() {
        const urls = {};

        if (this.props.notifications.action === 'consign') {
            urls.accept = 'ownership_consigns_confirm';
            urls.deny = 'ownership_consigns_deny';
        } else if (this.props.notifications.action === 'unconsign') {
            urls.accept = 'ownership_unconsigns';
            urls.deny = 'ownership_unconsigns_deny';
        } else if (this.props.notifications.action === 'loan' && !this.isPiece()) {
            urls.accept = 'ownership_loans_confirm';
            urls.deny = 'ownership_loans_deny';
        } else if (this.props.notifications.action === 'loan' && this.isPiece()) {
            urls.accept = 'ownership_loans_pieces_confirm';
            urls.deny = 'ownership_loans_pieces_deny';
        } else if (this.props.notifications.action === 'loan_request' && this.isPiece()) {
            urls.accept = 'ownership_loans_pieces_request_confirm';
            urls.deny = 'ownership_loans_pieces_request_deny';
        }

        // Resolve the urls
        Object.entries(urls).forEach(([key, val]) => {
            urls[key] = resolveUrl(val);
        });

        return urls;
    },

    getFormData() {
        return getAclFormDataId(this.isPiece(), this.props.pieceOrEditions);
    },

    showNotification(option, action, owner) {
        return () => {
            const message = getLangText('You have successfully %s the %s request from %s', getLangText(option), getLangText(action), owner);
            const notifications = new GlobalNotificationModel(message, 'success');
            GlobalNotificationActions.appendGlobalNotification(notifications);

            this.handleSuccess();
        };
    },

    handleSuccess() {
        if (this.isPiece()) {
            NotificationActions.fetchPieceListNotifications();
        } else {
            NotificationActions.fetchEditionListNotifications();
        }

        if (typeof this.props.handleSuccess === 'function') {
            this.props.handleSuccess();
        }
    },

    getContent() {
        return (
            <span>
                {this.props.notifications.action_str + ' by ' + this.props.notifications.by}
            </span>
        );
    },

    getAcceptButtonForm(urls) {
        if (this.props.notifications.action === 'unconsign') {
            return (
                <UnconsignButton
                    availableAcls={{'acl_unconsign': true}}
                    buttonAcceptClassName='inline pull-right btn-sm ascribe-margin-1px'
                    pieceOrEditions={this.props.pieceOrEditions}
                    handleSuccess={this.handleSuccess} />
                );
        } else if (this.props.notifications.action === 'loan_request') {
            return (
                <LoanRequestButton
                    availableAcls={{'acl_loan_request': true}}
                    buttonAcceptName="LOAN"
                    buttonAcceptClassName='inline pull-right btn-sm ascribe-margin-1px'
                    pieceOrEditions={this.props.pieceOrEditions}
                    handleSuccess={this.handleSuccess} />
                );
        } else {
            return (
                <Form
                    url={urls.accept}
                    getFormData={this.getFormData}
                    handleSuccess={
                        this.showNotification('accepted', this.props.notifications.action, this.props.notifications.by)
                    }
                    isInline={true}
                    className='inline pull-right'>
                    <button
                        type="submit"
                        className='btn btn-default btn-sm ascribe-margin-1px'>
                        {getLangText('ACCEPT')}
                    </button>
                </Form>
            );
        }
    },

    getButtonForm() {
        const urls = this.getUrls();
        const acceptButtonForm = this.getAcceptButtonForm(urls);

        return (
            <div>
                <Form
                    url={urls.deny}
                    isInline={true}
                    getFormData={this.getFormData}
                    handleSuccess={
                        this.showNotification('denied', this.props.notifications.action, this.props.notifications.by)
                    }
                    className='inline pull-right'>
                    <button
                        type="submit"
                        className='btn btn-danger btn-delete btn-sm ascribe-margin-1px'>
                        {getLangText('REJECT')}
                    </button>
                </Form>
                {acceptButtonForm}
            </div>
        );
    },

    render() {
        return (
            <ActionPanel
                content={this.getContent()}
                buttons={this.getButtonForm()} />
        );
    }
});


export default RequestActionForm;
