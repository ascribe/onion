'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

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

import AuthProxyHandler from '../../../components/ascribe_routes/proxy_routes/auth_proxy_handler';


let baseUrl = AppConstants.baseUrl;

function getRoutes() {
    return (
        <Route path={baseUrl} component={App}>
            <IndexRoute component={Landing} />
            <Route
                path='login'
                component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(LoginContainer)} />
            <Route
                path='logout'
                component={AuthProxyHandler({to: '/', when: 'loggedOut'})(LogoutContainer)}/>
            <Route
                path='signup'
                component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(SignupContainer)} />
            <Route
                path='password_reset'
                component={AuthProxyHandler({to: '/collection', when: 'loggedIn'})(PasswordResetContainer)} />
            <Route
                path='settings'
                component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(SettingsContainer)}/>
            <Route
                path='register_piece'
                component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(PrizeRegisterPiece)}
                headerTitle='+ NEW WORK'/>
            <Route
                path='collection'
                component={AuthProxyHandler({to: '/login', when: 'loggedOut'})(PrizePieceList)}
                headerTitle='COLLECTION'/>

            <Route path='pieces/:pieceId' component={PrizePieceContainer} />
            <Route path='editions/:editionId' component={EditionContainer} />
            <Route path='verify' component={CoaVerifyContainer} />
            <Route path='*' component={ErrorNotFoundPage} />
        </Route>
    );
}


export default getRoutes;
