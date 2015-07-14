'use strict';

import React from 'react';
import Router from 'react-router';

import Landing from './components/landing';
import LoginContainer from './components/login_container';
import SignupContainer from './components/signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';
import PrizeRegisterPiece from './components/register_piece';
import PrizePieceList from './components/piece_list';
import PieceContainer from '../../ascribe_detail/piece_container';
import EditionContainer from '../../ascribe_detail/edition_container';
import SettingsContainer from '../../../components/settings_container';

import App from './app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
let baseUrl = AppConstants.baseUrl;


function getRoutes(commonRoutes) {
    return (
        <Route name="app" path={baseUrl} handler={App}>
            <Route name="landing" path={baseUrl} handler={Landing} />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
            <Route name="register_piece" path="register_piece" handler={PrizeRegisterPiece} />
            <Route name="pieces" path="collection" handler={PrizePieceList} />
            <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
            <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
            <Route name="settings" path="settings" handler={SettingsContainer} />
        </Route>
    );
}


export default getRoutes;
