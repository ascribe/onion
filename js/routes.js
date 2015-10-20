'use strict';

import React from 'react';
import { Route } from 'react-router';

import getPrizeRoutes from './components/whitelabel/prize/prize_routes';
import getWalletRoutes from './components/whitelabel/wallet/wallet_routes';

import App from './components/ascribe_app';

import PieceList from './components/piece_list';
import PieceContainer from './components/ascribe_detail/piece_container';
import EditionContainer from './components/ascribe_detail/edition_container';

import LoginContainer from './components/login_container';
import LogoutContainer from './components/logout_container';
import SignupContainer from './components/signup_container';
import PasswordResetContainer from './components/password_reset_container';

import ContractSettings from './components/ascribe_settings/contract_settings';
import SettingsContainer from './components/ascribe_settings/settings_container';
import CoaVerifyContainer from './components/coa_verify_container';

import ErrorNotFoundPage from './components/error_not_found_page';

import RegisterPiece from './components/register_piece';

import AuthProxyHandler from './components/ascribe_routes/proxy_routes/auth_proxy_handler';


let COMMON_ROUTES = (
    <Route path='/' component={App}>
        <Route
            path='login'
            component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(LoginContainer)} />
        <Route
            path='register_piece'
            component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(RegisterPiece)}
            headerTitle='+ NEW WORK'/>
        <Route
            path='collection'
            component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(PieceList)}
            headerTitle='COLLECTION'/>
        <Route
            path='signup'
            component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(SignupContainer)} />
        <Route
            path='logout'
            component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(LogoutContainer)}/>
        <Route path='pieces/:pieceId' component={PieceContainer} />
        <Route path='editions/:editionId' component={EditionContainer} />
        <Route
            path='password_reset'
            component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(PasswordResetContainer)} />
        <Route
            path='settings'
            component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(SettingsContainer)}/>
        <Route
            path='contract_settings'
            component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(ContractSettings)}/>
        <Route path='coa_verify' component={CoaVerifyContainer} />
        <Route path='*' component={ErrorNotFoundPage} />
    </Route>
);


function getRoutes(type, subdomain) {
    let routes = null;

    if (type === 'prize') {
        routes = getPrizeRoutes(COMMON_ROUTES, subdomain);
    } else if(type === 'wallet') {
        routes = getWalletRoutes(COMMON_ROUTES, subdomain);
    } else {
        routes = COMMON_ROUTES;
    }

    return routes;
}


export default getRoutes;
