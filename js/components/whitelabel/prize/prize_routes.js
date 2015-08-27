'use strict';

import React from 'react';
import Router from 'react-router';

import Landing from './components/prize_landing';
import LoginContainer from './components/prize_login_container';
import LogoutContainer from '../../../components/logout_container';
import SignupContainer from './components/prize_signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';
import PrizeRegisterPiece from './components/prize_register_piece';
import PrizePieceList from './components/prize_piece_list';
import PrizePieceContainer from './components/ascribe_detail/prize_piece_container';
import EditionContainer from '../../ascribe_detail/edition_container';
import SettingsContainer from './components/prize_settings_container';

import App from './prize_app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
let baseUrl = AppConstants.baseUrl;


function getRoutes() {
    return (
        <Route name="app" path={baseUrl} handler={App}>
            <Route name="landing" path={baseUrl} handler={Landing} />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="logout" path="logout" handler={LogoutContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
            <Route name="register_piece" path="register_piece" handler={PrizeRegisterPiece} headerTitle="+ NEW WORK" />
            <Route name="pieces" path="collection" handler={PrizePieceList} headerTitle="COLLECTION" />
            <Route name="piece" path="pieces/:pieceId" handler={PrizePieceContainer} />
            <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
            <Route name="settings" path="settings" handler={SettingsContainer} />
        </Route>
    );
}


export default getRoutes;