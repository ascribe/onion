'use strict';

import React from 'react';
import Header from '../../header';
import Footer from '../../footer';

import GlobalNotification from '../../global_notification';

import getRoutes from './wallet_routes';
import classNames from 'classnames';

import { getSubdomain } from '../../../utils/general_utils';


let WalletApp = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        history: React.PropTypes.object,
        routes: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render() {
        let subdomain = getSubdomain();
        let ROUTES = getRoutes(null, subdomain);

        // In react-router 1.0, Routes have no 'name' property anymore. To keep functionality however,
        // we split the path by the first occurring slash and take the first splitter.
        let activeRoutes = this.props.routes.map(elem => 'route--' + elem.path.split('/')[0]);

        let header = null;
        if ((this.props.history.isActive('/login') || this.props.history.isActive('/signup') || this.props.history.isActive('/contract_notifications'))
            && (['ikonotv', 'cyland']).indexOf(subdomain) > -1) {
            header = (<div className="hero"/>);
        } else {
            header = <Header showAddWork={true} routes={ROUTES} />;
        }

        return (
            <div className={classNames('ascribe-wallet-app', activeRoutes)}>
                <div className='container'>
                    {header}
                    {this.props.children}
                    <GlobalNotification />
                    <div id="modal" className="container"></div>
                    <Footer />
                </div>
            </div>
        );
    }
});

export default WalletApp;
