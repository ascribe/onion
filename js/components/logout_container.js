'use strict';

import React from 'react';
import { History } from 'react-router';

import UserActions from '../actions/user_actions';
import { alt, altWhitelabel, altUser, altThirdParty } from '../alt';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let LogoutContainer = React.createClass({

    mixins: [History],

    componentDidMount() {
        UserActions.logoutCurrentUser();
        alt.flush();
        altWhitelabel.flush();
        altUser.flush();
        altThirdParty.flush();
        // kill intercom (with fire)
        window.Intercom('shutdown');
    },

    render() {
        setDocumentTitle(getLangText('Log out'));

        return null;
    }

});


export default LogoutContainer;
