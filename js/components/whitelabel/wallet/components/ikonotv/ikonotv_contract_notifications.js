'use strict';

import React from 'react';
import { History } from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import NotificationActions from '../../../../../actions/notification_actions';
import NotificationStore from '../../../../../stores/notification_store';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import OwnershipFetcher from '../../../../../fetchers/ownership_fetcher';

import WhitelabelStore from '../../../../../stores/whitelabel_store';
import WhitelabelActions from '../../../../../actions/whitelabel_actions';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import CopyrightAssociationForm from '../../../../ascribe_forms/form_copyright_association';

import Property from '../../../../ascribe_forms/property';

import AppConstants from '../../../../../constants/application_constants';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';


let IkonotvContractNotifications = React.createClass({

    mixins: [History],

    getInitialState() {
        return mergeOptions(
            NotificationStore.getState(),
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
        if (this.state.contractAgreementListNotifications === null){
            NotificationActions.fetchContractAgreementListNotifications();
        }
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getContract(){
        let notifications = this.state.contractAgreementListNotifications[0];
        let blob = notifications.contract_agreement.contract.blob;
        if (blob.mime === 'pdf') {
            return (
                <div className='notification-contract-pdf'>
                    <embed
                        height
                        src={blob.url_safe}
                        alt="pdf"
                        pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                </div>
            );
        }
        return (
            <div className='notification-contract-download'>
                <a href={blob.url_safe} target="_blank">
                    <Glyphicon glyph='download-alt'/>
                    <span style={{padding: '0.3em'}}>
                        Download contract
                    </span>
                </a>
            </div>
        );
    },

    getAppendix() {
        let notifications = this.state.contractAgreementListNotifications[0];
        let appendix = notifications.contract_agreement.appendix;
        if (appendix && appendix.default) {
            return (
                <Property
                    name='appendix'
                    label={getLangText('Appendix')}>
                    <pre className="ascribe-pre">{appendix.default}</pre>
                </Property>
            );
        }
        return null;
    },

    handleConfirm() {
        let contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
        OwnershipFetcher.confirmContractAgreement(contractAgreement).then(
            () => this.handleConfirmSuccess()
        );
    },

    handleConfirmSuccess() {
        let notification = new GlobalNotificationModel(getLangText('You have accepted the conditions'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.history.pushState(null, '/collection');
    },

    handleDeny() {
        let contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
        OwnershipFetcher.denyContractAgreement(contractAgreement).then(
            () => this.handleDenySuccess()
        );
    },

    handleDenySuccess() {
        let notification = new GlobalNotificationModel(getLangText('You have denied the conditions'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.history.pushState(null, '/collection');
    },

    getCopyrightAssociationForm(){
        let currentUser = this.state.currentUser;

        if (currentUser && currentUser.profile && !currentUser.profile.copyright_association) {
            return (
                <div className='notification-contract-footer'>
                    <h1>{getLangText('Are you a member of any copyright societies?')}</h1>

                    <p>
                        {AppConstants.copyrightAssociations.join(', ')}
                    </p>
                    <CopyrightAssociationForm currentUser={currentUser}/>
                </div>
            );
        }
        return null;
    },

    render() {
        setDocumentTitle(getLangText('Contacts notifications'));

        if (this.state.contractAgreementListNotifications &&
            this.state.contractAgreementListNotifications.length > 0) {

            let notifications = this.state.contractAgreementListNotifications[0];
            let blob = notifications.contract_agreement.contract.blob;

            return (
                <div className='container'>
                    <div className='notification-contract-wrapper'>
                        <div className='notification-contract-logo'>
                            <img src={this.state.whitelabel.logo}/>
                            <div className='notification-contract-header'>
                                {getLangText('Contract')}
                            </div>
                        </div>
                        {this.getContract()}
                        <div className='notification-contract-footer'>
                            {this.getAppendix()}
                            <div className='notification-contract-pdf-download'>
                                <a href={blob.url_safe} target="_blank">
                                    <Glyphicon glyph='download-alt'/>
                                    <span style={{padding: '0.3em'}}>
                                        Download PDF version
                                    </span>
                                </a>
                            </div>
                            {this.getCopyrightAssociationForm()}
                            <p style={{marginTop: '1em'}}>
                                <Button type="submit" onClick={this.handleConfirm}>
                                    {getLangText('I agree with the conditions')}
                                </Button>
                                <Button bsStyle="danger" className="btn-delete" bsSize="medium" onClick={this.handleDeny}>
                                    {getLangText('I disagree')}
                                </Button>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
});

export default IkonotvContractNotifications;
