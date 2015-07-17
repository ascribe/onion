'use strict';

import React from 'react';
import Router from 'react-router';

import getPrizeRoutes from './components/whitelabel/prize/routes';
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
    </Route>
);


function getRoutes(type) {
    let routes = null;

    if (type === 'prize') {
        routes = getPrizeRoutes(COMMON_ROUTES);
    } else {
        routes = getDefaultRoutes(COMMON_ROUTES);
    }

    return routes;
}


export default getRoutes;
