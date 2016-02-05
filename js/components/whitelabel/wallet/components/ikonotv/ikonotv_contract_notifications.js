'use strict';

import React from 'react';
import { History } from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import NotificationActions from '../../../../../actions/notification_actions';
import NotificationStore from '../../../../../stores/notification_store';

import OwnershipFetcher from '../../../../../fetchers/ownership_fetcher';

import CopyrightAssociationForm from '../../../../ascribe_forms/form_copyright_association';
import Property from '../../../../ascribe_forms/property';

import AppConstants from '../../../../../constants/application_constants';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';


let IkonotvContractNotifications = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    mixins: [History],

    getInitialState() {
        return NotificationStore.getState();
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);

        if (this.state.contractAgreementListNotifications === null){
            NotificationActions.fetchContractAgreementListNotifications();
        }
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    getContract(){
        const notifications = this.state.contractAgreementListNotifications[0];
        const blob = notifications.contract_agreement.contract.blob;

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
        } else {
            return (
                <div className='notification-contract-download'>
                    <a href={blob.url_safe} target="_blank">
                        <Glyphicon glyph='download-alt'/>
                        <span style={{padding: '0.3em'}}>
                            {getLangText('Download contract')}
                        </span>
                    </a>
                </div>
            );
        }
    },

    getAppendix() {
        const notifications = this.state.contractAgreementListNotifications[0];
        const appendix = notifications.contract_agreement.appendix;

        if (appendix && appendix.default) {
            return (
                <Property
                    name='appendix'
                    label={getLangText('Appendix')}>
                    <pre className="ascribe-pre">{appendix.default}</pre>
                </Property>
            );
        } else {
            return null;
        }
    },

    handleConfirm() {
        const contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
        OwnershipFetcher
            .confirmContractAgreement(contractAgreement)
            .then(this.handleConfirmSuccess);
    },

    handleConfirmSuccess() {
        const notification = new GlobalNotificationModel(getLangText('You have accepted the conditions'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        // Flush contract notifications and refetch
        NotificationActions.flushContractAgreementListNotifications();
        NotificationActions.fetchContractAgreementListNotifications();

        this.history.push('/collection');
    },

    handleDeny() {
        const contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
        OwnershipFetcher
            .denyContractAgreement(contractAgreement)
            .then(this.handleDenySuccess);
    },

    handleDenySuccess() {
        const notification = new GlobalNotificationModel(getLangText('You have denied the conditions'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);

        this.history.push('/collection');
    },

    getCopyrightAssociationForm(){
        const { currentUser } = this.props;

        if (currentUser.profile && !currentUser.profile.copyright_association) {
            return (
                <div className='notification-contract-footer'>
                    <h1>{getLangText('Are you a member of any copyright societies?')}</h1>

                    <p>
                        {AppConstants.copyrightAssociations.join(', ')}
                    </p>
                    <CopyrightAssociationForm currentUser={currentUser}/>
                </div>
            );
        } else {
            return null;
        }
    },

    render() {
        const { whitelabel } = this.props;
        const { contractAgreementListNotifications } = this.state;

        setDocumentTitle(getLangText('Contacts notifications'));

        if (contractAgreementListNotifications && contractAgreementListNotifications.length) {
            const notifications = contractAgreementListNotifications[0];
            const blob = notifications.contract_agreement.contract.blob;

            return (
                <div className='container'>
                    <div className='notification-contract-wrapper'>
                        <div className='notification-contract-logo'>
                            <img src={whitelabel.logo} />
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
                                        {getLangText('Download PDF version')}
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
        } else {
            return null;
        }
    }
});

export default IkonotvContractNotifications;
