'use strict';

import React from 'react';

import AclButton from './../ascribe_buttons/acl_button';
import ActionPanel from '../ascribe_panel/action_panel';
import Form from './form';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ApiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils.js';


let RequestActionForm = React.createClass({
    propTypes: {
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        requestAction: React.PropTypes.string,
        requestUser: React.PropTypes.string,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    isPiece(){
        return this.props.pieceOrEditions.constructor !== Array;
    },

    getUrls() {
        let urls = {};

        if (this.props.requestAction === 'consign'){
            urls.accept = ApiUrls.ownership_consigns_confirm;
            urls.deny = ApiUrls.ownership_consigns_deny;
        } else if (this.props.requestAction === 'unconsign'){
            urls.accept = ApiUrls.ownership_unconsigns;
            urls.deny = ApiUrls.ownership_unconsigns_deny;
        } else if (this.props.requestAction === 'loan' && !this.isPiece()){
            urls.accept = ApiUrls.ownership_loans_confirm;
            urls.deny = ApiUrls.ownership_loans_deny;
        } else if (this.props.requestAction === 'loan' && this.isPiece()){
            urls.accept = ApiUrls.ownership_loans_pieces_confirm;
            urls.deny = ApiUrls.ownership_loans_pieces_deny;
        } else if (this.props.requestAction === 'loan_request' && this.isPiece()){
            urls.accept = ApiUrls.ownership_loans_pieces_request_confirm;
            urls.deny = ApiUrls.ownership_loans_pieces_request_deny;
        }

        return urls;
    },

    getFormData(){
        if (this.isPiece()) {
            return {piece_id: this.props.pieceOrEditions.id};
        }
        else {
            return {bitcoin_id: this.props.pieceOrEditions.map(function(edition){
                return edition.bitcoin_id;
            }).join()};
        }
    },

    showNotification(option, action, owner) {
        return () => {
            let message = getLangText('You have successfully') + ' ' + option + ' the ' + action + ' request ' + getLangText('from') + ' ' + owner;

            let notification = new GlobalNotificationModel(message, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);

            if(this.props.handleSuccess) {
                this.props.handleSuccess();
            }
        };
    },

    getContent() {
        let message = this.props.requestUser + ' ' + getLangText('requests you') + ' ' + this.props.requestAction + ' ' + getLangText('this edition%s', '.');

        return (
            <span>
                {message}
            </span>
        );
    },

    getAcceptButtonForm(urls) {
        if(this.props.requestAction === 'unconsign') {
            return (
                <AclButton
                    availableAcls={{'acl_unconsign': true}}
                    action="acl_unconsign"
                    buttonAcceptClassName='inline pull-right btn-sm ascribe-margin-1px'
                    pieceOrEditions={this.props.pieceOrEditions}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                );
        } else if(this.props.requestAction === 'loan_request') {
            return (
                <AclButton
                    availableAcls={{'acl_loan_request': true}}
                    action="acl_loan_request"
                    buttonAcceptName="LOAN"
                    buttonAcceptClassName='inline pull-right btn-sm ascribe-margin-1px'
                    pieceOrEditions={this.props.pieceOrEditions}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                );
        } else {
            return (
                <Form
                    url={urls.accept}
                    getFormData={this.getFormData}
                    handleSuccess={
                        this.showNotification(getLangText('accepted'), this.props.requestAction, this.props.requestUser)
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
        let urls = this.getUrls();
        let acceptButtonForm = this.getAcceptButtonForm(urls);

        return (
            <div>
                <Form
                    url={urls.deny}
                    isInline={true}
                    getFormData={this.getFormData}
                    handleSuccess={
                        this.showNotification(getLangText('denied'), this.props.requestAction, this.props.requestUser)
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
                buttons={this.getButtonForm()}/>
        );
    }
});


export default RequestActionForm;