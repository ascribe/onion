'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';

import AccountSettings from './account_settings';
import BitcoinWalletSettings from './bitcoin_wallet_settings';
import APISettings from './api_settings';
import WebhookSettings from './webhook_settings';

import AclProxy from '../acl_proxy';

import { mergeOptions } from '../../utils/general_utils';
import { getLangText } from '../../utils/lang_utils';
import { setDocumentTitle } from '../../utils/dom_utils';


let SettingsContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),

        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    loadUser(invalidateCache) {
        UserActions.fetchCurrentUser(invalidateCache);
    },

    render() {
        const { children, currentUser, whitelabel } = this.props;

        setDocumentTitle(getLangText('Account settings'));

        if (currentUser && currentUser.username) {
            return (
                <div className="settings-container">
                    <AccountSettings
                        currentUser={currentUser}
                        loadUser={this.loadUser}
                        whitelabel={whitelabel} />
                    {children}
                    <AclProxy
                        aclObject={whitelabel}
                        aclName="acl_view_settings_api">
                        <APISettings />
                    </AclProxy>
                    <WebhookSettings />
                    <AclProxy
                        aclObject={whitelabel}
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
