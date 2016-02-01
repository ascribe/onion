'use strict';

import React from 'react';

import Hero from './components/prize_hero';

import AppBase from '../../../app_base';
import Header from '../../../header';

import { getSubdomain } from '../../../../utils/general_utils';


let PrizeApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        history: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    render() {
        const { activeRoute, children, history, routes } = this.props;
        const subdomain = getSubdomain();

        // The second element of routes is always the active component object, where we can
        // extract the path.
        let path = routes[1] ? routes[1].path : null;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if (!path || history.isActive('/login') || history.isActive('/signup')) {
            header = (<Hero />);
        } else {
            header = (<Header routes={routes} />);
        }

        return (
            <div className="ascribe-prize-app">
                {header}
                <div className="container ascribe-body">
                    {/* Routes are injected here */}
                    {children}
                </div>
            </div>
        );
    }
});

export default AppBase(PrizeApp);
