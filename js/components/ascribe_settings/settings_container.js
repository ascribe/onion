'use strict';

import React from 'react';
import Router from 'react-router';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import AccountSettings from './account_settings';
import BitcoinWalletSettings from './bitcoin_wallet_settings';
import ContractSettings from './contract_settings';
import APISettings from './api_settings';


let SettingsContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element])
    },

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

    loadUser(){
        UserActions.fetchCurrentUser();
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        if (this.state.currentUser && this.state.currentUser.username) {
            return (
                <div className="settings-container">
                    <AccountSettings currentUser={this.state.currentUser} loadUser={this.loadUser}/>
                    {this.props.children}
                    <APISettings />
                    <BitcoinWalletSettings />
                </div>
            );
        }
        return null;
    }
});

export default SettingsContainer;
