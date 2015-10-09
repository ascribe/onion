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

import ProxyRoute from '../../../components/ascribe_routes/proxy_route';
import RedirectProxyHandler from '../../../components/ascribe_routes/proxy_routes/redirect_proxy_handler';


let baseUrl = AppConstants.baseUrl;

function getRoutes() {
    return (
        <Route path={baseUrl} component={App}>
            <IndexRoute component={Landing} />
            <ProxyRoute
                path="login"
                proxyHandler={RedirectProxyHandler({to: '/collection', when: 'loggedIn'})}
                component={LoginContainer} />
            <ProxyRoute
                path="logout"
                proxyHandler={RedirectProxyHandler({to: '/', when: 'loggedOut'})}
                component={LogoutContainer}/>
            <ProxyRoute
                path="signup"
                proxyHandler={RedirectProxyHandler({to: '/collection', when: 'loggedIn'})}
                component={SignupContainer} />
            <ProxyRoute
                path="password_reset"
                proxyHandler={RedirectProxyHandler({to: '/collection', when: 'loggedIn'})}
                component={PasswordResetContainer} />
            <ProxyRoute
                path="settings"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={SettingsContainer}/>

            <ProxyRoute
                path="register_piece"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={PrizeRegisterPiece}
                headerTitle="+ NEW WORK"/>
            <ProxyRoute
                path="collection"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={PrizePieceList}
                headerTitle="COLLECTION"/>
            <Route path="pieces/:pieceId" component={PrizePieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    );
}


export default getRoutes;