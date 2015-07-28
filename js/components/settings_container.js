'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WalletSettingsActions from '../actions/wallet_settings_actions';
import WalletSettingsStore from '../stores/wallet_settings_store';

import ApplicationActions from '../actions/application_actions';
import ApplicationStore from '../stores/application_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import ReactS3FineUploader from './ascribe_uploader/react_s3_fine_uploader';

import CollapsibleParagraph from './ascribe_collapsible/collapsible_paragraph';
import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';
import InputCheckbox from './ascribe_forms/input_checkbox';

import apiUrls from '../constants/api_urls';
import AppConstants from '../constants/application_constants';
import { getLangText } from '../utils/lang_utils';

import { getCookie } from '../utils/fetch_api_utils';

let SettingsContainer = React.createClass({
    mixins: [Router.Navigation],

    render() {
        return (
            <div className="settings-container">
                <AccountSettings />
                <APISettings />
                <BitcoinWalletSettings />
                <LoanContractSettings />
                <br />
                <br />
            </div>
        );
    }
});


let AccountSettings = React.createClass({
    getInitialState() {
        return UserStore.getState();
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSuccess(){
        UserActions.fetchCurrentUser();
        let notification = new GlobalNotificationModel(getLangText('Settings succesfully updated'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getFormDataProfile(){
        return {'email': this.state.currentUser.email};
    },
    render() {
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;
        let profile = null;

        if (this.state.currentUser.username) {
            content = (
                <Form
                    url={apiUrls.users_username}
                    handleSuccess={this.handleSuccess}>
                    <Property
                        name='username'
                        label={getLangText('Username')}>
                        <input
                            type="text"
                            defaultValue={this.state.currentUser.username}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <Property
                        name='email'
                        label={getLangText('Email')}
                        editable={false}>
                        <input
                            type="text"
                            defaultValue={this.state.currentUser.email}
                            placeholder={getLangText('Enter your username')}
                            required/>
                    </Property>
                    <hr />
                </Form>
            );
            profile = (
                <Form
                    url={apiUrls.users_profile}
                    handleSuccess={this.handleSuccess}
                    getFormData={this.getFormDataProfile}>
                    <Property
                        name="hash_locally"
                        className="ascribe-settings-property-collapsible-toggle"
                        style={{paddingBottom: 0}}>
                        <InputCheckbox
                            defaultValue={this.state.currentUser.profile.hash_locally}>
                            <span>
                                {' ' + getLangText('Enable hash option for slow connections. ' +
                                    'Computes and uploads a hash of the work instead.')}
                            </span>
                        </InputCheckbox>
                    </Property>
                    {/*<Property
                        name='language'
                        label={getLangText('Choose your Language')}
                        editable={true}>
                        <select id="select-lang" name="language">
                            <option value="fr">
                                Fran&ccedil;ais
                            </option>
                            <option value="en"
                                    selected="selected">
                                English
                            </option>
                        </select>
                    </Property>*/}
                    <hr />
                </Form>
            );
        }
        return (
            <CollapsibleParagraph
                title={getLangText('Account')}
                show={true}
                defaultExpanded={true}>
                {content}
                {profile}
                {/*<Form
                    url={AppConstants.serverUrl + 'api/users/set_language/'}>
                    <Property
                        name='language'
                        label={getLangText('Choose your Language')}
                        editable={true}>
                        <select id="select-lang" name="language">
                            <option value="fr">
                                Fran&ccedil;ais
                            </option>
                            <option value="en"
                                    selected="selected">
                                English
                            </option>
                        </select>
                    </Property>
                    <hr />
                </Form>*/}
            </CollapsibleParagraph>
        );
    }
});



let BitcoinWalletSettings = React.createClass({

    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    getInitialState() {
        return WalletSettingsStore.getState();
    },

    componentDidMount() {
        WalletSettingsStore.listen(this.onChange);
        WalletSettingsActions.fetchWalletSettings();
    },

    componentWillUnmount() {
        WalletSettingsStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;
        if (this.state.walletSettings.btc_public_key) {
            content = (
                <Form >
                    <Property
                        name='btc_public_key'
                        label={getLangText('Bitcoin public key')}
                        editable={false}>
                        <pre className="ascribe-pre">{this.state.walletSettings.btc_public_key}</pre>
                    </Property>
                    <Property
                        name='btc_root_address'
                        label={getLangText('Root Address')}
                        editable={false}>
                        <pre className="ascribe-pre">{this.state.walletSettings.btc_root_address}</pre>
                    </Property>
                    <hr />
                </Form>);
        }
        return (
            <CollapsibleParagraph
                title={getLangText('Crypto Wallet')}
                show={true}
                defaultExpanded={this.props.defaultExpanded}>
                {content}
            </CollapsibleParagraph>
        );
    }
});

let LoanContractSettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    render() {

        return (
            <CollapsibleParagraph
                title="Loan Contract Settings"
                show={true}
                defaultExpanded={this.props.defaultExpanded}>
                    <FileUploader />
            </CollapsibleParagraph>
        );
    }
});

let FileUploader = React.createClass({
    propTypes: {
    },

    render() {
        return (
            <Form>
                <Property
                    label="Contract file">
                    <ReactS3FineUploader
                        keyRoutine={{
                            url: AppConstants.serverUrl + 's3/key/',
                            fileClass: 'contract'
                        }}
                        createBlobRoutine={{
                            url: apiUrls.ownership_loans_contract
                        }}
                        validation={{
                            itemLimit: 100000,
                            sizeLimit: '10000000'
                        }}
                        session={{
                            endpoint: apiUrls.ownership_loans_contract,
                            customHeaders: {
                                'X-CSRFToken': getCookie(AppConstants.csrftoken)
                            },
                            cors: {
                                expected: true,
                                sendCredentials: true
                            }
                        }}
                        signature={{
                            endpoint: AppConstants.serverUrl + 's3/signature/',
                            customHeaders: {
                               'X-CSRFToken': getCookie(AppConstants.csrftoken)
                            }
                        }}
                        deleteFile={{
                            enabled: true,
                            method: 'DELETE',
                            endpoint: AppConstants.serverUrl + 's3/delete',
                            customHeaders: {
                               'X-CSRFToken': getCookie(AppConstants.csrftoken)
                            }
                        }}
                        areAssetsDownloadable={true}
                        areAssetsEditable={true}/>
                </Property>
                <hr />
            </Form>
        );
    }
});

let APISettings = React.createClass({
    propTypes: {
        defaultExpanded: React.PropTypes.bool
    },

    getInitialState() {
        return ApplicationStore.getState();
    },

    componentDidMount() {
        ApplicationStore.listen(this.onChange);
        ApplicationActions.fetchApplication();
    },

    componentWillUnmount() {
        ApplicationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },
    handleCreateSuccess: function(){
        ApplicationActions.fetchApplication();
        let notification = new GlobalNotificationModel(getLangText('Application successfully created'), 'success', 5000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    handleTokenRefresh: function(event){
        let applicationName = event.target.getAttribute('data-id');
        ApplicationActions.refreshApplicationToken(applicationName);
        let notification = new GlobalNotificationModel(getLangText('Token refreshed'), 'success', 2000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        let content = <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />;
        if (this.state.applications.length > -1) {
            content = this.state.applications.map(function(app) {
                return (
                    <Property
                        name={app.name}
                        label={app.name}>
                        <div className="row-same-height">
                            <div className="no-padding col-xs-6 col-sm-10 col-xs-height col-middle">
                            {'Bearer ' + app.bearer_token.token}
                            </div>
                            <div className="col-xs-6 col-sm-2 col-xs-height">
                                <button
                                    className="pull-right btn btn-default btn-sm"
                                    onClick={this.handleTokenRefresh}
                                    data-id={app.name}>
                                    {getLangText('REFRESH')}
                                </button>
                            </div>
                        </div>
                    </Property>);
            }, this);
            content = (
                <div>
                    <Form>
                        {content}
                        <hr />
                    </Form>
                </div>);
        }
        return (
            <CollapsibleParagraph
                title={getLangText('API Integration')}
                show={true}
                defaultExpanded={this.props.defaultExpanded}>
                <Form
                    url={apiUrls.applications}
                    handleSuccess={this.handleCreateSuccess}>
                    <Property
                        name='name'
                        label={getLangText('Application Name')}>
                        <input
                            type="text"
                            placeholder={getLangText('Enter the name of your app')}
                            required/>
                    </Property>
                    <hr />
                </Form>
                <pre>
                    Usage: curl &lt;url&gt; -H 'Authorization: Bearer &lt;token&gt;'
                </pre>
                {content}
            </CollapsibleParagraph>
        );
    }
});

export default SettingsContainer;
