'use strict';

import React from 'react';
import classNames from 'classnames';

import AppBase from '../../app_base';
import Header from '../../header';

import { getSubdomain } from '../../../utils/general_utils';


let WalletApp = React.createClass({
    propTypes: {
        history: React.PropTypes.object.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    render() {
        const { children, history, routes } = this.props;
        const subdomain = getSubdomain();

        // The second element of routes is always the active component object, where we can
        // extract the path.
        let path = routes[1] ? routes[1].path : null;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if ((!path || history.isActive('/login') || history.isActive('/signup') || history.isActive('/contract_notifications'))
            && (['cyland', 'ikonotv', 'lumenus', '23vivi']).indexOf(subdomain) > -1) {
            header = (<div className="hero" />);
        } else {
            header = (<Header routes={routes} />);
        }

        // In react-router 1.0, Routes have no 'name' property anymore. To keep functionality however,
        // we split the path by the first occurring slash and take the first splitter.
        return (
            <div className={classNames('ascribe-wallet-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
                {header}
                <div className="container ascribe-body">
                    {/* Routes are injected here */}
                    {children}
                </div>
            </div>
        );
    }
});

export default AppBase(WalletApp);
