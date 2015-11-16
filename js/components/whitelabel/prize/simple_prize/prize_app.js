'use strict';

import React from 'react';
import Hero from './components/prize_hero';
import Header from '../../../header';
import Footer from '../../../footer';
import GlobalNotification from '../../../global_notification';

import { getSubdomain } from '../../../../utils/general_utils';


let PrizeApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        history: React.PropTypes.object,
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render() {
        const { history, routes } = this.props;
        let header = null;
        let subdomain = getSubdomain();

        // The second element of routes is always the active component object, where we can
        // extract the path.
        let path = routes[1] ? routes[1].path : null;

        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if (!path || history.isActive('/login') || history.isActive('/signup')) {
            header = <Hero />;
        } else {
            header = <Header showAddWork={false} routes={routes}/>;
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
