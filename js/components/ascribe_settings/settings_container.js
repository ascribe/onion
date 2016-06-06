'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';

import AccountSettings from './account_settings';
import ApiSettings from './api_settings';
import BitcoinWalletSettings from './bitcoin_wallet_settings';
import WebhookSettings from './webhook_settings';

import AclProxy from '../acl_proxy';
import { currentUserShape } from '../prop_types';

import { setDocumentTitle } from '../../utils/dom_utils';
import { getLangText } from '../../utils/lang_utils';
import { withCurrentUser } from '../../utils/react_utils';


let SettingsContainer = React.createClass({
    propTypes: {
        currentUser: currentUserShape.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),

        // Provided from AscribeApp
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    loadUser(invalidateCache) {
        UserActions.fetchCurrentUser(invalidateCache);
    },

    render() {
        const { children, currentUser, whitelabel } = this.props;

        setDocumentTitle(getLangText('Account settings'));

        if (currentUser.username) {
            return (
                <div className="settings-container">
                    <AccountSettings
                        loadUser={this.loadUser}
                        whitelabel={whitelabel} />
                    {children}
                    <AclProxy
                        aclObject={whitelabel}
                        aclName="acl_view_settings_api">
                        <ApiSettings />
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

export default withCurrentUser(SettingsContainer);
