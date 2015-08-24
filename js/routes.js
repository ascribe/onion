'use strict';

import React from 'react';
import Router from 'react-router';

import getPrizeRoutes from './components/whitelabel/prize/prize_routes';
import getWalletRoutes from './components/whitelabel/wallet/wallet_routes';
import getDefaultRoutes from './components/routes';

import PieceList from './components/piece_list';
import PieceContainer from './components/ascribe_detail/piece_container';
import EditionContainer from './components/ascribe_detail/edition_container';

import LoginContainer from './components/login_container';
import LogoutContainer from './components/logout_container';
import SignupContainer from './components/signup_container';
import PasswordResetContainer from './components/password_reset_container';

import SettingsContainer from './components/settings_container';
import CoaVerifyContainer from './components/coa_verify_container';

import RegisterPiece from './components/register_piece';

import PrizesDashboard from './components/ascribe_prizes_dashboard/prizes_dashboard';

let Route = Router.Route;


const COMMON_ROUTES = (
    <Route>
        <Route name="signup" path="signup" handler={SignupContainer} />
        <Route name="login" path="login" handler={LoginContainer} />
        <Route name="logout" path="logout" handler={LogoutContainer} />
        <Route name="pieces" path="collection" handler={PieceList} />
        <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
        <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
        <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
        <Route name="register_piece" path="register_piece" handler={RegisterPiece} />
        <Route name="settings" path="settings" handler={SettingsContainer} />
        <Route name="coa_verify" path="verify" handler={CoaVerifyContainer} />
        <Route name="prizes" path="prizes" handler={PrizesDashboard} />
    </Route>
);


function getRoutes(type, subdomain) {
    let routes = null;

    if (type === 'prize') {
        routes = getPrizeRoutes(COMMON_ROUTES, subdomain);
    } else if(type === 'wallet') {
        routes = getWalletRoutes(COMMON_ROUTES, subdomain);
    } else {
        routes = getDefaultRoutes(COMMON_ROUTES);
    }

    return routes;
}


export default getRoutes;
