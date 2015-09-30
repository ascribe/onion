'use strict';

import React from 'react';
import { Route } from 'react-router';

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
import CoaVerifyContainer from '../../../components/coa_verify_container';
import ErrorNotFoundPage from '../../../components/error_not_found_page';

import App from './prize_app';
import AppConstants from '../../../constants/application_constants';


let baseUrl = AppConstants.baseUrl;

function getRoutes() {
    return (
        <Route path={baseUrl} component={App}>
            <Route path={baseUrl} component={Landing} />
            <Route path="login" component={LoginContainer} />
            <Route path="logout" component={LogoutContainer} />
            <Route path="signup" component={SignupContainer} />
            <Route path="password_reset" component={PasswordResetContainer} />
            <Route path="register_piece" component={PrizeRegisterPiece} headerTitle="+ NEW WORK" />
            <Route path="collection" component={PrizePieceList} headerTitle="COLLECTION" />
            <Route path="pieces/:pieceId" component={PrizePieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="settings" component={SettingsContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    );
}


export default getRoutes;