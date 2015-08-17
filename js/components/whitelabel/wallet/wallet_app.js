'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../../header';
import GlobalNotification from '../../global_notification';

let RouteHandler = Router.RouteHandler;

let WalletApp = React.createClass({
    render() {
        return (
            <div className="container ascribe-prize-app">
                <Header />
                <RouteHandler />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default WalletApp;
