'use strict';

import React from 'react';
import Router from 'react-router';

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

import RegisterPiece from './components/register_piece';

import AppConstants from './constants/application_constants';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


const COMMON_ROUTES = (
    <Route name="app" path={baseUrl} handler={App}>
        <Redirect from={baseUrl} to="login" />
        <Redirect from={baseUrl + '/'} to="login" />
        <Route name="signup" path="signup" handler={SignupContainer} />
        <Route name="login" path="login" handler={LoginContainer} />
        <Route name="logout" path="logout" handler={LogoutContainer} />
        <Route name="register_piece" path="register_piece" handler={RegisterPiece} headerTitle="+ NEW WORK" />
        <Route name="pieces" path="collection" handler={PieceList} headerTitle="COLLECTION" />
        <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
        <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
        <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
        <Route name="settings" path="settings" handler={SettingsContainer} />
        <Route name="contract_settings" path="contract_settings" handler={ContractSettings} />
        <Route name="coa_verify" path="verify" handler={CoaVerifyContainer} />
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
