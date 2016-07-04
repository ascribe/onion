'use strict';

import React from 'react';

import UserActions from '../../actions/user_actions';

import AccountSettings from './account_settings';
import ApiSettings from './api_settings';
import BitcoinWalletSettings from './bitcoin_wallet_settings';
import WebhookSettings from './webhook_settings';

import AclProxy from '../acl_proxy';
import withContext from '../context/with_context';
import { whitelabelShape } from '../prop_types';

import { setDocumentTitle } from '../../utils/dom';
import { getLangText } from '../../utils/lang';


let SettingsContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),

        // Injected through HOCs
        isLoggedIn: React.PropTypes.bool.isRequired, // eslint-disable-line react/sort-prop-types
        whitelabel: whitelabelShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    loadUser(invalidateCache) {
        UserActions.fetchCurrentUser(invalidateCache);
    },

    render() {
        const { children, isLoggedIn, whitelabel } = this.props;

        setDocumentTitle(getLangText('Account settings'));

        if (isLoggedIn) {
            return (
                <div className="settings-container">
                    <AccountSettings loadUser={this.loadUser} />
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

export default withContext(SettingsContainer, 'isLoggedIn', 'whitelabel');
