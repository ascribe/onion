'use strict';

import React from 'react';
import Router from 'react-router';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';

import Form from '../../../../ascribe_forms/form';
import Property from '../../../../ascribe_forms/property';
import InputCheckbox from '../../../../ascribe_forms/input_checkbox';

import NotificationActions from '../../../../../actions/notification_actions';
import NotificationStore from '../../../../../stores/notification_store';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import apiUrls from '../../../../../constants/api_urls';

import requests from '../../../../../utils/requests';
import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let Navigation = Router.Navigation;

let IkonotvContractNotifications = React.createClass({

    mixins: [Navigation],

    getInitialState() {
        return mergeOptions(
            NotificationStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
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

    displayContract(){
        let notifications = this.state.contractAgreementListNotifications[0];
        let blob = notifications.contract_agreement.contract.blob;
        if (blob.mime === 'pdf') {
            return (
                <div className='notification-contract-pdf'>
                    <embed src={blob.url_safe} alt="pdf"
                           pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"/>
                    <div className='notification-contract-pdf-download'>
                        <a href={blob.url_safe}>
                            <Glyphicon glyph='download-alt'/>
                            <span style={{padding: '0.3em'}}>
                                Download PDF version
                            </span>
                        </a>
                    </div>
                </div>
            );
        }
        return (
            <div className='notification-contract-download'>
                <a href={blob.url_safe}>
                    <Glyphicon glyph='download-alt'/>
                    Download contract
                </a>
            </div>
        );
    },

    handleConfirmSuccess() {
        let notification = new GlobalNotificationModel(getLangText('You have accepted the conditions'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.transitionTo('pieces');
    },

    handleDeny() {
        let contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
        requests.post(apiUrls.ownership_contract_agreements_deny, {contract_agreement_id: contractAgreement.id}).then(
            () => this.handleDenySuccess()
        );
    },

    handleDenySuccess() {
        let notification = new GlobalNotificationModel(getLangText('You have denied the conditions'), 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
        this.transitionTo('pieces');
    },

    render() {

        if (this.state.contractAgreementListNotifications &&
            this.state.contractAgreementListNotifications.length > 0) {
            let contractAgreement = this.state.contractAgreementListNotifications[0].contract_agreement;
            return (
                <div className='container'>
                    <div className='notification-contract-wrapper'>
                        <div className='notification-contract-logo'>
                            <img src={this.state.whitelabel.logo}/>
                            <div className='notification-contract-header'>
                                {getLangText('Production Contract')}
                            </div>
                        </div>
                        {this.displayContract()}
                        <div className='notification-contract-footer'>
                            <h1>{getLangText('Are you a member of any copyright societies?')}</h1>
                            <p>
                                ARS, DACS, Bildkunst, Pictoright, SODRAC, Copyright Agency/Viscopy, SAVA, Bildrecht GmbH,
                                SABAM, AUTVIS, CREAIMAGEN, SONECA, Copydan, EAU, Kuvasto, GCA, HUNGART, IVARO, SIAE, JASPAR-SPDA,
                                AKKA/LAA, LATGA-A, SOMAAP, ARTEGESTION, CARIER, BONO, APSAV, SPA, GESTOR, VISaRTA, RAO, LITA,
                                DALRO, VeGaP, BUS, ProLitteris, AGADU, AUTORARTE, BUBEDRA, BBDA, BCDA, BURIDA, ADAVIS, BSDA
                            </p>
                            <Form
                                ref='form'
                                url={requests.prepareUrl(apiUrls.ownership_contract_agreements_confirm, {contract_agreement_id: contractAgreement.id})}
                                handleSuccess={this.handleConfirmSuccess}
                                buttons={
                                    <p style={{marginTop: '1em'}}>
                                        <Button type="submit">{getLangText('I agree with the conditions')}</Button>
                                        <Button bsStyle="danger" className="btn-delete" bsSize="medium" onClick={this.handleDeny}>
                                            {getLangText('I disagree')}
                                        </Button>
                                    </p>
                                }>
                                <Property
                                    name="terms"
                                    className="ascribe-settings-property-collapsible-toggle"
                                    style={{paddingBottom: 0}}>
                                    <InputCheckbox>
                                        <span>
                                            {' ' + getLangText('Yes') }
                                        </span>
                                    </InputCheckbox>
                                </Property>

                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
});

export default IkonotvContractNotifications;