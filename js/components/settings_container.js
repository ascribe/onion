'use strict';

import React from 'react';
import Router from 'react-router';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WalletSettingsActions from '../actions/wallet_settings_actions';
import WalletSettingsStore from '../stores/wallet_settings_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import CollapsibleParagraph from './ascribe_collapsible/collapsible_paragraph';
import Form from './ascribe_forms/form';
import Property from './ascribe_forms/property';

import apiUrls from '../constants/api_urls';
import AppConstants from '../constants/application_constants';


let SettingsContainer = React.createClass({
    mixins: [Router.Navigation],

    render() {
        return (
            <div>
                <AccountSettings />
                <BitcoinWalletSettings />
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
        let notification = new GlobalNotificationModel('username succesfully updated', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        if (this.state.currentUser.username) {
            return (
                <CollapsibleParagraph
                    title="Account"
                    show={true}
                    defaultExpanded={true}>
                    <Form
                        url={apiUrls.users_username}
                        handleSuccess={this.handleSuccess}>
                        <Property
                            name='username'
                            label="Username">
                            <input
                                type="text"
                                defaultValue={this.state.currentUser.username}
                                placeholder="Enter your username"
                                required/>
                        </Property>
                        <Property
                            name='email'
                            label="Email"
                            editable={false}>
                            <input
                                type="text"
                                defaultValue={this.state.currentUser.email}
                                placeholder="Enter your username"
                                required/>
                        </Property>
                    </Form>
                </CollapsibleParagraph>
            );
        }
        else {
            return (
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            );
        }
    }
});



let BitcoinWalletSettings = React.createClass({

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
         if (this.state.walletSettings.btc_public_key) {
            return (
                <CollapsibleParagraph
                    title="Crypto Wallet"
                    show={true}
                    defaultExpanded={true}>
                    <Form
                        url={apiUrls.users_username}
                        handleSuccess={this.handleSuccess}>
                        <Property
                            name='btc_public_key'
                            label="Bitcoin public key"
                            editable={false}>
                            <input
                                type="text"
                                defaultValue={this.state.walletSettings.btc_public_key}
                                placeholder="Enter your username"
                                required/>
                        </Property>
                        <Property
                            name='btc_root_address'
                            label="Root Address"
                            editable={false}>
                            <input
                                type="text"
                                defaultValue={this.state.walletSettings.btc_root_address}/>
                        </Property>
                    </Form>
                </CollapsibleParagraph>
            );
        }
        else {
            return (
                <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
            );
        }
    }
});

let ContractSettings = React.createClass({

    propTypes: {
        currentUser: React.PropTypes.object
    },

    render() {

        return (
            <div>
                <div>Username: {this.props.currentUser.username}</div>
                <div>Email: {this.props.currentUser.email}</div>
            </div>
        );
    }
});

let APISettings = React.createClass({

    propTypes: {
        currentUser: React.PropTypes.object
    },

    render() {

        return (
            <div>
                <div>Username: {this.props.currentUser.username}</div>
                <div>Email: {this.props.currentUser.email}</div>
            </div>
        );
    }
});

export default SettingsContainer;