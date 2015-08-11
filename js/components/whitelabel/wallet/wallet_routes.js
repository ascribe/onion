'use strict';

import React from 'react';
import Router from 'react-router';

import LoginContainer from '../../../components/login_container';
import LogoutContainer from '../../../components/logout_container';
import SignupContainer from '../../../components/signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';
import WalletRegisterPiece from './components/wallet_register_piece';
import PieceList from '../../../components/piece_list';
import PieceContainer from '../../../components/ascribe_detail/piece_container';
import EditionContainer from '../../../components/ascribe_detail/edition_container';
import SettingsContainer from '../../../components/settings_container';

import WalletApp from './wallet_app';
import AppConstants from '../../../constants/application_constants';

let Route = Router.Route;
let baseUrl = AppConstants.baseUrl;


function getRoutes() {
    return (
        <Route name="app" path={baseUrl} handler={WalletApp}>
            <Route name="landing" path={baseUrl} handler={WalletRegisterPiece} />
            <Route name="login" path="login" handler={LoginContainer} />
            <Route name="logout" path="logout" handler={LogoutContainer} />
            <Route name="signup" path="signup" handler={SignupContainer} />
            <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
            <Route name="register_piece" path="register_piece" handler={WalletRegisterPiece} />
            <Route name="pieces" path="collection" handler={PieceList} />
            <Route name="piece" path="pieces/:pieceId" handler={PieceContainer} />
            <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
            <Route name="settings" path="settings" handler={SettingsContainer} />
        </Route>
    );
}


export default getRoutes;