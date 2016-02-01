'use strict';

import React from 'react';

import AppBase from './app_base';
import Header from './header';


let AscribeApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

    render() {
        const { activeRoute, children, routes } = this.props;

        return (
            <div className="ascribe-default-app">
                <Header routes={routes} />
                <div className="container ascribe-body">
                    {/* Routes are injected here */}
                    {children}
                </div>
            </div>
        );
    }
});

export default AppBase(AscribeApp);
