'use strict';

import React from 'react';
import Router from 'react-router';
import Header from '../components/header';
import GlobalNotification from './global_notification';

let Link = Router.Link;
let RouteHandler = Router.RouteHandler;


let AscribeApp = React.createClass({
    render() {
        return (
            <div>
                <Header />
                <RouteHandler />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default AscribeApp;
