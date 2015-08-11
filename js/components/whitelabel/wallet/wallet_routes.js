'use strict';

import React from 'react';
import Router from 'react-router';

import LoginContainer from '../../../components/login_container';
import LogoutContainer from '../../../components/logout_container';
import SignupContainer from '../../../components/signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';
import CylandRegisterPiece from './components/cyland/cyland_register_piece';
import PieceList from '../../../components/piece_list';
import PieceContainer from '../../../components/ascribe_detail/piece_container';
import EditionContainer from '../../../components/ascribe_detail/edition_container';
import SettingsContainer from '../../../components/settings_container';

import RegisterPiece from '../../../components/register_piece';

import WalletApp from './wallet_app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


let ROUTES = {
    'cyland': (
        <Route name="app" path={baseUrl} handler={WalletApp}>
            <Route name="landing" path={baseUrl} handler={CylandRegisterPiece} />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="logout" path="logout" handler={LogoutContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
            <Route name="register_piece" path="register_piece" handler={CylandRegisterPiece} />
            <Route name="pieces" path="collection" handler={PieceList} />
            <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
            <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
            <Route name="settings" path="settings" handler={SettingsContainer} />
        </Route>
    ),
    'cc': (
        <Route name="app" path={baseUrl} handler={WalletApp}>
            <Redirect from={baseUrl} to="login" />
            <Redirect from={baseUrl + '/'} to="login" />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="logout" path="logout" handler={LogoutContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
            <Route name="register_piece" path="register_piece" handler={RegisterPiece} />
            <Route name="pieces" path="collection" handler={PieceList} />
            <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
            <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
            <Route name="settings" path="settings" handler={SettingsContainer} />
        </Route>
    )
};


function getRoutes(commonRoutes, subdomain) {
    if(subdomain in ROUTES) {
        return ROUTES[subdomain];
    } else {
        throw new Error('Subdomain wasn\'t specified in the wallet app.');
    }
}


export default getRoutes;