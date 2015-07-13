'use strict';

import React from 'react';

import ConsignForm from '../ascribe_forms/form_consign';
import UnConsignForm from '../ascribe_forms/form_unconsign';
import TransferForm from '../ascribe_forms/form_transfer';
import LoanForm from '../ascribe_forms/form_loan';
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
        availableAcls: React.PropTypes.array.isRequired,
        pieceOrEditions: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },

    isPiece(){
        return !(this.props.pieceOrEditions.constructor === Array);
    },
    actionProperties(){
        if (this.props.action === 'consign'){
            return {
                title: getLangText('Consign artwork'),
                tooltip: getLangText('Have someone else sell the artwork'),
                form: <ConsignForm currentUser={ this.props.currentUser } editions={ this.props.pieceOrEditions }/>,
                handleSuccess: this.showNotification
            };
        }
        if (this.props.action === 'unconsign'){
            return {
                title: getLangText('Unconsign artwork'),
                tooltip: getLangText('Have the owner manage his sales again'),
                form: <UnConsignForm currentUser={ this.props.currentUser } editions={ this.props.pieceOrEditions }/>,
                handleSuccess: this.showNotification
            };
        }else if (this.props.action === 'transfer') {
            return {
                title: getLangText('Transfer artwork'),
                tooltip: getLangText('Transfer the ownership of the artwork'),
                form: <TransferForm currentUser={ this.props.currentUser } editions={ this.props.pieceOrEditions }/>,
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'loan'){
            return {
                title: getLangText('Loan artwork'),
                tooltip: getLangText('Loan your artwork for a limited period of time'),
                form: <LoanForm currentUser={ this.props.currentUser } editions={ this.props.pieceOrEditions }/>,
                handleSuccess: this.showNotification
            };
        }
        else if (this.props.action === 'share'){
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
        }
    },

    showNotification(response){
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

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

    render() {
        let shouldDisplay = this.props.availableAcls.indexOf(this.props.action) > -1;
        let aclProps = this.actionProperties();
        return (
            <ModalWrapper
                button={
                    <button className={shouldDisplay ? 'btn btn-default btn-sm ' : 'hidden'}>
                        {this.props.action.toUpperCase()}
                    </button>
                }
                handleSuccess={ aclProps.handleSuccess }
                title={ aclProps.title }
                tooltip={ aclProps.tooltip }>
                { aclProps.form }
            </ModalWrapper>
        );
    },

    getShareMessage(){
        return (
`${getLangText('Hi')},

${getLangText('I am sharing')} :
${this.getTitlesString()}${getLangText('with you')}.

${getLangText('Truly yours')},
${this.props.currentUser.username}`
        );
    }
});

export default AclButton;