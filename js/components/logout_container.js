'use strict';

import React from 'react';
import Router from 'react-router';

let Link = Router.Link;
import UserActions from '../actions/user_actions';
import Alt from '../alt';

import AppConstants from '../constants/application_constants';
let baseUrl = AppConstants.baseUrl;

let LogoutContainer = React.createClass({

    mixins: [Router.Navigation, Router.State],

    componentDidMount() {
        UserActions.logoutCurrentUser();
        Alt.flush();
        // kill intercom (with fire)
        window.Intercom('shutdown');
        this.transitionTo(baseUrl);
    },

    render() {
        return null;
    }

});


export default LogoutContainer;
