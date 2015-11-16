'use strict';

import React from 'react';

import UserStore from '../../stores/user_store';
import UserActions from '../../actions/user_actions';

import WhitelabelStore from '../../stores/whitelabel_store';
import WhitelabelActions from '../../actions/whitelabel_actions';

import AccountSettings from './account_settings';
import BitcoinWalletSettings from './bitcoin_wallet_settings';
import APISettings from './api_settings';

import AclProxy from '../acl_proxy';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';
import { setDocumentTitle } from '../../utils/dom_utils';


let SettingsContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element])
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    loadUser(invalidateCache){
        UserActions.fetchCurrentUser(invalidateCache);
    },

    onChange(state) {
        this.setState(state);
    },

    render() {
        setDocumentTitle(getLangText('Account settings'));

        if (this.state.currentUser && this.state.currentUser.username) {
            return (
                <div className="settings-container">
                    <AccountSettings
                        currentUser={this.state.currentUser}
                        loadUser={this.loadUser}
                        whitelabel={this.state.whitelabel}/>
                    {this.props.children}
                    <AclProxy
                        aclObject={this.state.whitelabel}
                        aclName="acl_view_settings_api">
                        <APISettings />
                    </AclProxy>
                    <AclProxy
                        aclObject={this.state.whitelabel}
                        aclName="acl_view_settings_bitcoin">
                        <BitcoinWalletSettings />
                    </AclProxy>
                </div>
            );
        }
        return null;
    }
});

export default SettingsContainer;
