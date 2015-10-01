'use strict';

import React from 'react';
import Hero from './components/prize_hero';
import Header from '../../header';
import Footer from '../../footer';
import GlobalNotification from '../../global_notification';

import getRoutes from './prize_routes';

import { getSubdomain } from '../../../utils/general_utils';


let PrizeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        history: React.PropTypes.object
    },

    render() {
        let header = null;
        let subdomain = getSubdomain();

        let ROUTES = getRoutes(null, subdomain);

        if (this.props.history.isActive('/') || this.props.history.isActive('/login') || this.props.history.isActive('/signup')) {
            header = <Hero />;
        } else {
            header = <Header showAddWork={false} routes={ROUTES}/>;
        }

        return (
            <div className={'container ascribe-prize-app client--' + subdomain}>
                {header}
                {this.props.children}
                <GlobalNotification />
                <div id="modal" className="container"></div>
                <Footer />
            </div>
        );
    }
});

export default PrizeApp;
