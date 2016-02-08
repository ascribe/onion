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

import CCRegisterPiece from './components/cc/cc_register_piece';

import CylandLanding from './components/cyland/cyland_landing';
import CylandPieceContainer from './components/cyland/cyland_detail/cyland_piece_container';
import CylandRegisterPiece from './components/cyland/cyland_register_piece';
import CylandPieceList from './components/cyland/cyland_piece_list';

import IkonotvLanding from './components/ikonotv/ikonotv_landing';
import IkonotvPieceList from './components/ikonotv/ikonotv_piece_list';
import SendContractAgreementForm from '../../../components/ascribe_forms/form_send_contract_agreement';
import IkonotvRegisterPiece from './components/ikonotv/ikonotv_register_piece';
import IkonotvPieceContainer from './components/ikonotv/ikonotv_detail/ikonotv_piece_container';
import IkonotvContractNotifications from './components/ikonotv/ikonotv_contract_notifications';

import MarketPieceList from './components/market/market_piece_list';
import MarketRegisterPiece from './components/market/market_register_piece';
import MarketPieceContainer from './components/market/market_detail/market_piece_container';
import MarketEditionContainer from './components/market/market_detail/market_edition_container';

import LumenusLanding from './components/lumenus/lumenus_landing';

import Vivi23Landing from './components/23vivi/23vivi_landing';
import Vivi23PieceList from './components/23vivi/23vivi_piece_list';

import PollineLanding from './components/polline/polline_landing';

import { ProxyHandler, AuthRedirect } from '../../../components/ascribe_routes/proxy_handler';

import WalletApp from './wallet_app';


let ROUTES = {
    'cyland': (
        <Route path='/' component={WalletApp}>
            <IndexRoute
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(CylandLanding)}
                hideFooter />
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)}
                hideFooter />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)}
                hideFooter />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)}
                hideFooter />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)}
                hideFooter />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)}
                hideFooter />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)}
                hideFooter />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(CylandRegisterPiece)}
                headerTitle='+ NEW WORK'
                aclName='acl_wallet_submit'
                hideFooter />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(CylandPieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces'
                hideFooter />
            <Route
                path='editions/:editionId'
                component={EditionContainer}
                hideFooter />
            <Route
                path='coa_verify'
                component={CoaVerifyContainer}
                hideFooter />
            <Route
                path='pieces/:pieceId'
                component={CylandPieceContainer}
                hideFooter />
            <Route
                path='*'
                component={ErrorNotFoundPage}
                hideFooter />
        </Route>
    ),
    'cc': (
        <Route path='/' component={WalletApp}>
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)}
                hideFooter />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)}
                hideFooter />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)}
                hideFooter />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)}
                hideFooter />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)}
                hideFooter />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)}
                hideFooter />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(CCRegisterPiece)}
                headerTitle='+ NEW WORK'
                hideFooter />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(PieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces'
                hideFooter />
            <Route
                path='pieces/:pieceId'
                component={PieceContainer}
                hideFooter />
            <Route
                path='editions/:editionId'
                component={EditionContainer}
                hideFooter />
            <Route
                path='coa_verify'
                component={CoaVerifyContainer}
                hideFooter />
            <Route
                path='*'
                component={ErrorNotFoundPage}
                hideFooter />
        </Route>
    ),
    'ikonotv': (
        <Route path='/' component={WalletApp}>
            <IndexRoute
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(IkonotvLanding)}
                hideFooter />
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)}
                hideFooter />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)}
                hideFooter />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)}
                hideFooter />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)}
                hideFooter />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)}
                hideFooter />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)}
                hideFooter />
            <Route
                path='request_loan'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SendContractAgreementForm)}
                headerTitle='SEND NEW CONTRACT'
                aclName='acl_create_contractagreement'
                hideFooter />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(IkonotvRegisterPiece)}
                headerTitle='+ NEW WORK'
                aclName='acl_wallet_submit'
                hideFooter />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(IkonotvPieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces'
                hideFooter />
            <Route
                path='contract_notifications'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(IkonotvContractNotifications)}
                hideFooter />
            <Route
                path='pieces/:pieceId'
                component={IkonotvPieceContainer}
                hideFooter />
            <Route
                path='editions/:editionId'
                component={EditionContainer}
                hideFooter />
            <Route
                path='coa_verify'
                component={CoaVerifyContainer}
                hideFooter />
            <Route
                path='*'
                component={ErrorNotFoundPage}
                hideFooter />
        </Route>
    ),
    'lumenus': (
        <Route path='/' component={WalletApp}>
            <IndexRoute
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LumenusLanding)}
                hideFooter />
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)}
                hideFooter />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)}
                hideFooter />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)}
                hideFooter />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)}
                hideFooter />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)}
                hideFooter />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)}
                hideFooter />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(MarketRegisterPiece)}
                headerTitle='+ NEW WORK'
                aclName='acl_wallet_submit'
                hideFooter />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(MarketPieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces'
                hideFooter />
            <Route
                path='pieces/:pieceId'
                component={MarketPieceContainer}
                hideFooter />
            <Route
                path='editions/:editionId'
                component={MarketEditionContainer}
                hideFooter />
            <Route
                path='coa_verify'
                component={CoaVerifyContainer}
                hideFooter />
            <Route
                path='*'
                component={ErrorNotFoundPage}
                hideFooter />
        </Route>
    ),
    '23vivi': (
        <Route path='/' component={WalletApp}>
            <IndexRoute component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(Vivi23Landing)}
                hideFooter />
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)}
                hideFooter />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)}
                hideFooter />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)}
                hideFooter />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)}
                hideFooter />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)}
                hideFooter />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)}
                hideFooter />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(MarketRegisterPiece)}
                headerTitle='+ NEW WORK'
                aclName='acl_wallet_submit'
                hideFooter />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(Vivi23PieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces'
                hideFooter />
            <Route
                path='pieces/:pieceId'
                component={MarketPieceContainer}
                hideFooter />
            <Route
                path='editions/:editionId'
                component={MarketEditionContainer}
                hideFooter />
            <Route
                path='coa_verify'
                component={CoaVerifyContainer}
                hideFooter />
            <Route
                path='*'
                component={ErrorNotFoundPage}
                hideFooter />
        </Route>
    ),
    'polline': (
        <Route path='/' component={WalletApp}>
            <IndexRoute component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PollineLanding)} />
            <Route
                path='login'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(LoginContainer)} />
            <Route
                path='logout'
                component={ProxyHandler(AuthRedirect({to: '/', when: 'loggedOut'}))(LogoutContainer)} />
            <Route
                path='signup'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(SignupContainer)} />
            <Route
                path='password_reset'
                component={ProxyHandler(AuthRedirect({to: '/collection', when: 'loggedIn'}))(PasswordResetContainer)} />
            <Route
                path='settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(SettingsContainer)} />
            <Route
                path='contract_settings'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(ContractSettings)} />
            <Route
                path='register_piece'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(MarketRegisterPiece)}
                headerTitle='+ NEW WORK'
                aclName='acl_wallet_submit' />
            <Route
                path='collection'
                component={ProxyHandler(AuthRedirect({to: '/login', when: 'loggedOut'}))(MarketPieceList)}
                headerTitle='COLLECTION'
                disableOn='noPieces' />
            <Route path='pieces/:pieceId' component={MarketPieceContainer} />
            <Route path='editions/:editionId' component={MarketEditionContainer} />
            <Route path='verify' component={CoaVerifyContainer} />
            <Route path='*' component={ErrorNotFoundPage} />
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
