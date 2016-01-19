'use strict';

import React from 'react';

import AppBase from './app_base';
import Header from './header';

import AppConstants from '../constants/application_constants';


let AscribeApp = React.createClass({
    propTypes: {
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        const { children, routes } = this.props;

        return (
            <div className="container ascribe-default-app">
                <Header routes={routes} />
                {/* Routes are injected here */}
                <div className="ascribe-body">
                    {children}
                </div>
            </div>
        );
    }
});

export default AppBase(AscribeApp);
