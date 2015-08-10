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
        editions: React.PropTypes.arrayOf(React.PropTypes.object),
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func
    },

    getUrls() {
        let edition = this.props.editions[0];
        let urls = {};


        if (edition.request_action === 'consign'){
            urls.accept = ApiUrls.ownership_consigns_confirm;
            urls.deny = ApiUrls.ownership_consigns_deny;
        } else if (edition.request_action === 'unconsign'){
            urls.accept = ApiUrls.ownership_unconsigns;
            urls.deny = ApiUrls.ownership_unconsigns_deny;
        } else if (edition.request_action === 'loan'){
            urls.accept = ApiUrls.ownership_loans_confirm;
            urls.deny = ApiUrls.ownership_loans_deny;
        }

        return urls;
    },

    getBitcoinIds(){
        return this.props.editions.map(function(edition){
            return edition.bitcoin_id;
        });
    },

    getFormData() {
        return {
            bitcoin_id: this.getBitcoinIds().join()
        };
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
        let edition = this.props.editions[0];
        let message = edition.owner + ' ' + getLangText('requests you') + ' ' + edition.request_action + ' ' + getLangText('this edition%s', '.');

        return (
            <span>
                {message}
            </span>
        );
    },

    getAcceptButtonForm(urls) {
        let edition = this.props.editions[0];

        if(edition.request_action === 'unconsign') {
            return (
                <AclButton
                    availableAcls={{'acl_unconsign': true}}
                    action="acl_unconsign"
                    pieceOrEditions={this.props.editions}
                    currentUser={this.props.currentUser}
                    handleSuccess={this.props.handleSuccess} />
                );
        } else {
            return (
                <Form
                    url={urls.accept}
                    getFormData={this.getFormData}
                    handleSuccess={this.showNotification(getLangText('accepted'), edition.request_action, edition.owner)}
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
        let edition = this.props.editions[0];

        let urls = this.getUrls();
        let acceptButtonForm = this.getAcceptButtonForm(urls);

        return (
            <div>
                <Form
                    url={urls.deny}
                    isInline={true}
                    getFormData={this.getFormData}
                    handleSuccess={this.showNotification(getLangText('denied'), edition.request_action, edition.owner)}
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