'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeSpinner from './ascribe_spinner';

import UserActions from '../actions/user_actions';
import { alt, altWhitelabel, altUser, altThirdParty } from '../alt';

import AppConstants from '../constants/application_constants';

import { getLangText } from '../utils/lang_utils';


let baseUrl = AppConstants.baseUrl;

let LogoutContainer = React.createClass({

    mixins: [Router.Navigation, Router.State],

    componentDidMount() {
        UserActions.logoutCurrentUser()
            .then(() => {
                alt.flush();
                altWhitelabel.flush();
                altUser.flush();
                altThirdParty.flush();
                // kill intercom (with fire)
                window.Intercom('shutdown');
                this.replaceWith(baseUrl);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    },

    render() {
        return (
            <div className="ascribe-loading-position">
                <AscribeSpinner color='dark-blue' size='lg'/>
                <h3 className="text-center">
                    {getLangText('Just a sec, we\'re logging you out...')}
                </h3>
            </div>
        );
    }

});


export default LogoutContainer;
