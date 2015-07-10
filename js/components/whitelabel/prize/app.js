'use strict';

import React from 'react';
import Router from 'react-router';
import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

let RouteHandler = Router.RouteHandler;


let PrizeApp = React.createClass({
    render() {
        return (
            <div>
                <RouteHandler />
                <Footer />
                <GlobalNotification />
                <div id="modal" className="container"></div>
            </div>
        );
    }
});

export default PrizeApp;
