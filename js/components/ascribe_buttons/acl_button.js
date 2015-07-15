'use strict';

import React from 'react';

import ConsignForm from '../ascribe_forms/form_consign';
import UnConsignForm from '../ascribe_forms/form_unconsign';
import TransferForm from '../ascribe_forms/form_transfer';
import LoanForm from '../ascribe_forms/form_loan_new';
import ShareForm from '../ascribe_forms/form_share_email';
import ModalWrapper from '../ascribe_modal/modal_wrapper';
import AppConstants from '../../constants/application_constants';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getLangText } from '../../utils/lang_utils.js';
import apiUrls from '../../constants/api_urls';

let AclButton = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        availableAcls: React.PropTypes.object.isRequired,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },

    isPiece(){
        return this.props.pieceOrEditions.constructor !== Array;
    },

    actionProperties(){
        if (this.props.action === 'acl_consign'){
            return {
                title: getLangText('Consign artwork'),
                tooltip: getLangText('Have someone else sell the artwork'),
                form: (
                    <ConsignForm
                        message={this.getConsignMessage()}
                        id={this.getFormDataId()}
                        url={apiUrls.ownership_consigns}/>
                    ),
                handleSuccess: this.showNotification
            };
        }
        if (this.props.action === 'acl_unconsign'){
            return {
                title: getLangText('Unconsign artwork'),
                tooltip: getLangText('Have the owner manage his sales again'),
                form: (
                    <UnConsignForm
                        message={this.getUnConsignMessage()}
                        id={this.getFormDataId()}
                        url={apiUrls.ownership_unconsigns}/>
                    ),
                handleSuccess: this.showNotification
            };
        }else if (this.props.action === 'acl_transfer') {
            return {
                title: getLangText('Transfer artwork'),
                tooltip: getLangText('Transfer the ownership of the artwork'),
                form: (
                    <TransferForm
                        message={this.getTransferMessage()}
                        id={this.getFormDataId()}
                        url={apiUrls.ownership_transfers}/>
                ),
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'acl_loan'){
            return {
                title: getLangText('Loan artwork'),
                tooltip: getLangText('Loan your artwork for a limited period of time'),
                form: (<LoanForm
                        message={this.getLoanMessage()}
                        id={this.getFormDataId()}
                        url={this.isPiece() ? apiUrls.ownership_loans_pieces : apiUrls.ownership_loans_editions}/>
                ),
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'acl_share'){
            return {
                title: getLangText('Share artwork'),
                tooltip: getLangText('Share the artwork'),
                form: (
                    <ShareForm
                        message={this.getShareMessage()}
                        id={this.getFormDataId()}
                        url={this.isPiece() ? apiUrls.ownership_shares_pieces : apiUrls.ownership_shares_editions }/>
                    ),
                handleSuccess: this.showNotification
            };
        } else {
            throw new Error('Your specified action did not match a form.');
        }
    },

    showNotification(response){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    // plz move to share form
    getTitlesString(){
        if (this.isPiece()){
            return '\"' + this.props.pieceOrEditions.title + '\"';
        }
        else {
            return this.props.pieceOrEditions.map(function(edition) {
                return '- \"' + edition.title + ', ' + getLangText('edition') + ' ' + edition.edition_number + '\"\n';
            }).join('');
        }

    },

    getFormDataId(){
        if (this.isPiece()) {
            return {piece_id: this.props.pieceOrEditions.id};
        }
        else {
            return {bitcoin_id: this.props.pieceOrEditions.map(function(edition){
                return edition.bitcoin_id;
            }).join()};
        }
    },

// plz move to transfer form
    getTransferMessage(){
        return (
            `${getLangText('Hi')},

${getLangText('I transfer ownership of')}:
${this.getTitlesString()} ${getLangText('to you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}
            `
        );
    },

    // plz move to transfer form
    getLoanMessage(){
        return (
            `${getLangText('Hi')},

${getLangText('I loan')}:
${this.getTitlesString()} ${getLangText('to you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}
            `
        );
    },

    // plz move to consign form
    getConsignMessage(){
        return (
            `${getLangText('Hi')},

${getLangText('I consign')}:
${this.getTitlesString()} ${getLangText('to you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}
            `
        );
    },

    // plz move to consign form
    getUnConsignMessage(){
        return (
            `${getLangText('Hi')},

${getLangText('I un-consign')}:
${this.getTitlesString()} ${getLangText('from you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}
            `
        );
    },

// plz move to share form
    getShareMessage(){
        return (
            `${getLangText('Hi')},

${getLangText('I am sharing')}:
${this.getTitlesString()} ${getLangText('with you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}
            `
        );
    },

    // Removes the acl_ prefix and converts to upper case
    sanitizeAction() {
        return this.props.action.split('acl_')[1].toUpperCase();
    },

    render() {
        let shouldDisplay = this.props.availableAcls[this.props.action];
        let aclProps = this.actionProperties();

        return (
            <ModalWrapper
                button={
                    <button className={shouldDisplay ? 'btn btn-default btn-sm ' : 'hidden'}>
                        {this.sanitizeAction()}
                    </button>
                }
                handleSuccess={aclProps.handleSuccess}
                title={aclProps.title}
                tooltip={aclProps.tooltip}>
                {aclProps.form}
            </ModalWrapper>
        );
    }
});

export default AclButton;