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

import ProxyRoute from './components/ascribe_routes/proxy_route';
import RedirectProxyHandler from './components/ascribe_routes/proxy_routes/redirect_proxy_handler';

import AppConstants from './constants/application_constants';


let baseUrl = AppConstants.baseUrl;

let COMMON_ROUTES = (
    <Route path={baseUrl} component={App}>
        <ProxyRoute
            path="collection"
            proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
            component={PieceList}
            headerTitle="COLLECTION"/>
        <ProxyRoute
            path="login"
            proxyHandler={RedirectProxyHandler({to: '/collection', when: 'loggedIn'})}
            component={LoginContainer} />
        <Route path="register_piece" component={RegisterPiece} headerTitle="+ NEW WORK" />
        <Route path="signup" component={SignupContainer} />
        <Route path="logout" component={LogoutContainer} />
        <Route path="pieces/:pieceId" component={PieceContainer} />
        <Route path="editions/:editionId" component={EditionContainer} />
        <Route path="password_reset" component={PasswordResetContainer} />
        <Route path="settings" component={SettingsContainer} />
        <Route path="contract_settings" component={ContractSettings} />
        <Route path="coa_verify" component={CoaVerifyContainer} />
        <Route path="*" component={ErrorNotFoundPage} />
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
