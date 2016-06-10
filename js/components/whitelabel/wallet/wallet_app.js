import React from 'react';
import classNames from 'classnames';

import AppBase from '../../app_base';
import withContext from '../../context/with_context';
import Header from '../../header';
import { routerShape } from '../../prop_types';

import { getSubdomain } from '../../../utils/general_utils';


let WalletApp = React.createClass({
    propTypes: {
        activeRoute: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
        routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

        // Injected through HOCs
        router: routerShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    render() {
        const { activeRoute, children, router, routes } = this.props;
        const subdomain = getSubdomain();
        const path = activeRoute && activeRoute.path;
        const RouteFooterType = activeRoute && activeRoute.footer;

        let header = null;
        // if the path of the current activeRoute is not defined, then this is the IndexRoute
        if ((!path || router.isActive('/login') || router.isActive('/signup') || router.isActive('/contract_notifications'))
            && (['cyland', 'ikonotv', 'lumenus', '23vivi', 'polline', 'artcity', 'demo', 'liquidgallery']).includes(subdomain)) {
            header = (<div className="hero"/>);
        } else {
            header = (
                <Header routes={routes} />
            );
        }

        // In react-router 1.0, Routes have no 'name' property anymore. To keep functionality however,
        // we split the path by the first occurring slash and take the first splitter.
        return (
            <div className={classNames('ascribe-app', 'ascribe-wallet-app', `route--${(path ? path.split('/')[0] : 'landing')}`)}>
                {header}
                <div className="container ascribe-body">
                    {/* Routes are injected here */}
                    {children}
                </div>
                {RouteFooterType ? <RouteFooterType /> : null}
            </div>
        );
    }
});

export default AppBase(withContext(WalletApp, 'router'));
