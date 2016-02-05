'use strict';

import React from 'react';
import { History } from 'react-router';

import AscribeSpinner from './ascribe_spinner';

import UserActions from '../actions/user_actions';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


let LogoutContainer = React.createClass({
    propTypes: {
        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    mixins: [History],

    componentDidMount() {
        UserActions.logoutCurrentUser();
    },

    render() {
        setDocumentTitle(getLangText('Log out'));

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
