'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';

// general components
import CoaVerifyContainer from '../../../components/coa_verify_container';
import LoginContainer from '../../../components/login_container';
import LogoutContainer from '../../../components/logout_container';
import SignupContainer from '../../../components/signup_container';
import PasswordResetContainer from '../../../components/password_reset_container';
import PieceList from '../../../components/piece_list';
import PieceContainer from '../../../components/ascribe_detail/piece_container';
import EditionContainer from '../../../components/ascribe_detail/edition_container';
import SettingsContainer from '../../../components/ascribe_settings/settings_container';
import ContractSettings from '../../../components/ascribe_settings/contract_settings';
import ErrorNotFoundPage from '../../../components/error_not_found_page';

import CylandLanding from './components/cyland/cyland_landing';
import CylandPieceContainer from './components/cyland/ascribe_detail/cyland_piece_container';
import CylandRegisterPiece from './components/cyland/cyland_register_piece';
import CylandPieceList from './components/cyland/cyland_piece_list';

import IkonotvLanding from './components/ikonotv/ikonotv_landing';
import IkonotvPieceList from './components/ikonotv/ikonotv_piece_list';
import ContractAgreementForm from '../../../components/ascribe_forms/form_contract_agreement';
import IkonotvRegisterPiece from './components/ikonotv/ikonotv_register_piece';
import IkonotvPieceContainer from './components/ikonotv/ascribe_detail/ikonotv_piece_container';
import IkonotvContractNotifications from './components/ikonotv/ikonotv_contract_notifications';

import CCRegisterPiece from './components/cc/cc_register_piece';

import ProxyRoute from '../../../components/ascribe_routes/proxy_route';
import RedirectProxyHandler from '../../../components/ascribe_routes/proxy_routes/redirect_proxy_handler';

import WalletApp from './wallet_app';
import AppConstants from '../../../constants/application_constants';


let baseUrl = AppConstants.baseUrl;

let ROUTES = {
    'cyland': (
        <Route path={baseUrl} component={WalletApp}>
            <IndexRoute component={CylandLanding} />
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
                path="contract_settings"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={ContractSettings}/>
            <ProxyRoute
                path="register_piece"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={CylandRegisterPiece}
                headerTitle="+ NEW WORK"/>
            <ProxyRoute
                path="collection"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={CylandPieceList}
                headerTitle="COLLECTION"/>
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="pieces/:pieceId" component={CylandPieceContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    ),
    'cc': (
        <Route path={baseUrl} component={WalletApp}>
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
                path="contract_settings"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={ContractSettings}/>
            <ProxyRoute
                path="register_piece"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={CCRegisterPiece}
                headerTitle="+ NEW WORK"/>
            <ProxyRoute
                path="collection"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={PieceList}
                headerTitle="COLLECTION"/>
            <Route path="pieces/:pieceId" component={PieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    ),
    'ikonotv': (
        <Route path={baseUrl} component={WalletApp}>
            <IndexRoute component={IkonotvLanding} />
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
                path="contract_settings"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={ContractSettings}/>
            <ProxyRoute
                path="request_loan"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={ContractAgreementForm}
                headerTitle="SEND NEW CONTRACT"
                aclName="acl_create_contractagreement"/>
            <ProxyRoute
                path="register_piece"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={IkonotvRegisterPiece}
                headerTitle="+ NEW WORK"
                aclName="acl_create_piece"/>
            <ProxyRoute
                path="collection"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={IkonotvPieceList}
                headerTitle="COLLECTION"/>
            <ProxyRoute
                path="contract_notifications"
                proxyHandler={RedirectProxyHandler({to: '/login', when: 'loggedOut'})}
                component={IkonotvContractNotifications}/>
            <Route path="pieces/:pieceId" component={IkonotvPieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
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