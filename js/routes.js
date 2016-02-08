'use strict';

import React from 'react';
import { Route } from 'react-router';

import getPrizeRoutes from './components/whitelabel/prize/prize_routes';
import getWalletRoutes from './components/whitelabel/wallet/wallet_routes';

import AscribeApp from './components/ascribe_app';

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

import { ProxyHandler, AuthRedirect } from './components/ascribe_routes/proxy_handler';


const COMMON_ROUTES = (
    <Route path='/' component={AscribeApp}>
        <Route
            path='login'
            component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)} />
        <Route
            path='register_piece'
            component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(RegisterPiece)}
            headerTitle='+ NEW WORK' />
        <Route
            path='collection'
            component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(PieceList)}
            headerTitle='COLLECTION'
            disableOn='noPieces' />
        <Route
            path='signup'
            component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)} />
        <Route
            path='logout'
            component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(LogoutContainer)}/>
        <Route path='pieces/:pieceId' component={PieceContainer} />
        <Route path='editions/:editionId' component={EditionContainer} />
        <Route
            path='password_reset'
            component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)} />
        <Route
            path='settings'
            component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)} />
        <Route
            path='contract_settings'
            component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)} />
        <Route path='coa_verify' component={CoaVerifyContainer} />
        <Route path='*' component={ErrorNotFoundPage} />
    </Route>
);


function getRoutes(type, subdomain) {
    if (type === 'prize') {
        return getPrizeRoutes(COMMON_ROUTES, subdomain);
    } else if(type === 'wallet') {
        return getWalletRoutes(COMMON_ROUTES, subdomain);
    } else {
        return COMMON_ROUTES;
    }
}


export default getRoutes;
