'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../components/header';
import Footer from '../components/footer';
import GlobalNotification from './global_notification';

import getRoutes from '../routes';


let RouteHandler = Router.RouteHandler;

let AscribeApp = React.createClass({
    render() {
        return (
            <div className="container ascribe-default-app">
                <Header routes={getRoutes()} />
                <div className="ascribe-body">
                    <RouteHandler />
                </div>
                <Footer />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default AscribeApp;
