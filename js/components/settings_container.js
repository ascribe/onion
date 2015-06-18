'use strict';

import React from 'react';
import Router from 'react-router';

import CollapsibleMixin from 'react-bootstrap/lib/CollapsibleMixin';

import UserActions from '../actions/user_actions';
import UserStore from '../stores/user_store';

import WalletSettingsActions from '../actions/wallet_settings_actions';
import WalletSettingsStore from '../stores/wallet_settings_store';

import GlobalNotificationModel from '../models/global_notification_model';
import GlobalNotificationActions from '../actions/global_notification_actions';

import Input from 'react-bootstrap/lib/Input';

import classNames from 'classnames';

let SettingsContainer = React.createClass({
    mixins: [Router.Navigation],

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
        this.transitionTo('pieces');
        let notification = new GlobalNotificationModel('password succesfully updated', 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render() {
        return (
            <div>
                <CollapsibleParagraph
                    title="Account"
                    show={true}
                    defaultExpanded={true}>
                    <AccountSettings
                        currentUser={this.state.currentUser} />
                </CollapsibleParagraph>

                <CollapsibleParagraph
                    title="Bitcoin Wallet"
                    show={true}>
                    <BitcoinWalletSettings
                        currentUser={this.state.currentUser} />
                </CollapsibleParagraph>

                <CollapsibleParagraph
                    title="Contracts"
                    show={true}>
                    <ContractSettings
                        currentUser={this.state.currentUser} />
                </CollapsibleParagraph>

                <CollapsibleParagraph
                    title="API"
                    show={true}>
                    <APISettings
                        currentUser={this.state.currentUser} />
                </CollapsibleParagraph>
            </div>
      );
  }
});

const CollapsibleParagraph = React.createClass({

    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        iconName: React.PropTypes.string
    },

    mixins: [CollapsibleMixin],

    getCollapsibleDOMNode(){
        return React.findDOMNode(this.refs.panel);
    },

    getCollapsibleDimensionValue(){
        return React.findDOMNode(this.refs.panel).scrollHeight;
    },

    onHandleToggle(e){
        e.preventDefault();
        this.setState({expanded: !this.state.expanded});
    },

    render() {
        let styles = this.getCollapsibleClassSet();
        let text = this.isExpanded() ? '-' : '+';

        return (
            <div className="ascribe-detail-header">
                <div className="ascribe-edition-collapsible-wrapper">
                    <div onClick={this.onHandleToggle}>
                        <span>{text} {this.props.title} </span>
                    </div>
                    <div ref='panel' className={classNames(styles) + ' ascribe-edition-collapible-content'}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

let SettingsProperty = React.createClass({

    
    propTypes: {
        label: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        separator: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        valueClassName: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            separator: ':',
            labelClassName: 'col-xs-3 col-sm-3 col-md-2 col-lg-1',
            valueClassName: 'col-xs-9 col-sm-9 col-md-10 col-lg-11'
        };
    },

    getInitialState() {
        return {
            value: '',
            isFocused: false
        };
    },

    componentWillReceiveProps() {
        this.setState({
            value: this.props.value
        });
    },

    handleChange(event) {
        this.setState({value: event.target.value});
    },

    handleFocus() {
        this.refs.input.getDOMNode().focus();
        this.setState({
            isFocused: !this.state.isFocused
        });
    },

    getClassName() {
        if(this.state.isFocused) {
            return 'is-focused';
        } else {
            return '';
        }
    },

    render() {
        return (
            <div 
                className={'ascribe-settings-wrapper ' + this.getClassName()}
                onClick={this.handleFocus}>
                <div className="ascribe-settings-property">
                    <span>{ this.props.label}</span>
                    <input
                        ref="input"
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange} />
                </div>
            </div>
        );
    }
});

let AccountSettings = React.createClass({

    propTypes: {
        currentUser: React.PropTypes.object
    },

    render() {

        return (
            <div>
                <SettingsProperty key={1} label="Username" value={this.props.currentUser.username}/>
                <SettingsProperty key={2} label="Email" value={this.props.currentUser.email}/>
            </div>
        );
    }
});

let BitcoinWalletSettings = React.createClass({

    propTypes: {
        currentUser: React.PropTypes.object
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

        return (
            <div>
                <SettingsProperty label="Bitcoin public key" value={this.state.walletSettings.btc_public_key}/>
                <SettingsProperty label="Root Address" value={this.state.walletSettings.btc_root_address}/>
            </div>
        );
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