'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import PieceContainer from './components/ascribe_detail/piece_container';
import EditionContainer from './components/ascribe_detail/edition_container';

import LoginContainer from './components/login_container';
import SignupContainer from './components/signup_container';
import PasswordResetContainer from './components/password_reset_container';

import SettingsContainer from './components/settings_container';
import CoaVerifyContainer from './components/coa_verify_container';

import AppConstants from './constants/application_constants';
import RegisterPiece from './components/register_piece';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;

let routes = (
    <Route name="app" path={baseUrl} handler={AscribeApp}>
        <Route name="signup" path="signup" handler={SignupContainer} />
        <Route name="login" path="login" handler={LoginContainer} />
        <Route name="pieces" path="collection" handler={PieceList} />
        <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
        <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
        <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
        <Route name="register_piece" path="register_piece" handler={RegisterPiece} />
        <Route name="settings" path="settings" handler={SettingsContainer} />
        <Route name="coa_verify" path="verify" handler={CoaVerifyContainer} />

        <Redirect from={baseUrl} to="login" />
        <Redirect from={baseUrl + '/'} to="login" />
    </Route>
);

export default routes;
