'use strict';

import React from 'react';

import ConsignForm from '../ascribe_forms/form_consign';
import UnConsignForm from '../ascribe_forms/form_unconsign';
import TransferForm from '../ascribe_forms/form_transfer';
import LoanForm from '../ascribe_forms/form_loan';
import LoanRequestAnswerForm from '../ascribe_forms/form_loan_request_answer';
import ShareForm from '../ascribe_forms/form_share_email';
import ModalWrapper from '../ascribe_modal/modal_wrapper';
import AppConstants from '../../constants/application_constants';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import ApiUrls from '../../constants/api_urls';

import { getAclFormMessage } from '../../utils/form_utils';
import { getLangText } from '../../utils/lang_utils';

let AclButton = React.createClass({
    propTypes: {
        action: React.PropTypes.oneOf(AppConstants.aclList).isRequired,
        availableAcls: React.PropTypes.object.isRequired,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        currentUser: React.PropTypes.object,
        buttonAcceptName: React.PropTypes.string,
        buttonAcceptClassName: React.PropTypes.string,
        handleSuccess: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },

    isPiece(){
        return this.props.pieceOrEditions.constructor !== Array;
    },

    actionProperties(){

        let message = getAclFormMessage(this.props.action, this.getTitlesString(), this.props.currentUser.username);

        if (this.props.action === 'acl_consign'){
            return {
                title: getLangText('Consign artwork'),
                tooltip: getLangText('Have someone else sell the artwork'),
                form: (
                    <ConsignForm
                        message={message}
                        id={this.getFormDataId()}
                        url={ApiUrls.ownership_consigns}/>
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
                        message={message}
                        id={this.getFormDataId()}
                        url={ApiUrls.ownership_unconsigns}/>
                    ),
                handleSuccess: this.showNotification
            };
        }else if (this.props.action === 'acl_transfer') {
            return {
                title: getLangText('Transfer artwork'),
                tooltip: getLangText('Transfer the ownership of the artwork'),
                form: (
                    <TransferForm
                        message={message}
                        id={this.getFormDataId()}
                        url={ApiUrls.ownership_transfers}/>
                ),
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'acl_loan'){
            return {
                title: getLangText('Loan artwork'),
                tooltip: getLangText('Loan your artwork for a limited period of time'),
                form: (<LoanForm
                        message={message}
                        id={this.getFormDataId()}
                        url={this.isPiece() ? ApiUrls.ownership_loans_pieces : ApiUrls.ownership_loans_editions}/>
                ),
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'acl_loan_request'){
            return {
                title: getLangText('Loan artwork'),
                tooltip: getLangText('Someone requested you to loan your artwork for a limited period of time'),
                form: (<LoanRequestAnswerForm
                        message={message}
                        id={this.getFormDataId()}
                        url={ApiUrls.ownership_loans_pieces_request_confirm}/>
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
                        message={message}
                        id={this.getFormDataId()}
                        url={this.isPiece() ? ApiUrls.ownership_shares_pieces : ApiUrls.ownership_shares_editions }/>
                    ),
                handleSuccess: this.showNotification
            };
        } else {
            throw new Error('Your specified action did not match a form.');
        }
    },

    showNotification(response){
        this.props.handleSuccess();
        if(response.notification) {
            let notification = new GlobalNotificationModel(response.notification, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
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

    // Removes the acl_ prefix and converts to upper case
    sanitizeAction() {
        if (this.props.buttonAcceptName) {
            return this.props.buttonAcceptName;
        }
        return this.props.action.split('acl_')[1].toUpperCase();
    },

    render() {
        if (this.props.availableAcls){
            let shouldDisplay = this.props.availableAcls[this.props.action];
            let aclProps = this.actionProperties();
            let buttonClassName = this.props.buttonAcceptClassName ? this.props.buttonAcceptClassName : '';
            return (
                <ModalWrapper
                    trigger={
                        <button className={shouldDisplay ? 'btn btn-default btn-sm ' + buttonClassName : 'hidden'}>
                            {this.sanitizeAction()}
                        </button>
                    }
                    handleSuccess = {aclProps.handleSuccess}
                    title = {aclProps.title}>
                    {aclProps.form}
                </ModalWrapper>
            );
        }
        return null;
    }
});

export default AclButton;