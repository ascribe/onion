'use strict';

import React from 'react';
import Router from 'react-router';

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

    render() {
        return (
            <div className="settings-container">
                <AccountSettings />
                {this.props.children}
                <APISettings />
                <BitcoinWalletSettings />
                <ContractSettings />
            </div>
        );
    }
});

export default SettingsContainer;
