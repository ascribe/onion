'use strict';

import React from 'react';
import { Route, Redirect } from 'react-router';

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
import IkonotvRequestLoan from './components/ikonotv/ikonotv_request_loan';
import IkonotvRegisterPiece from './components/ikonotv/ikonotv_register_piece';
import IkonotvPieceContainer from './components/ikonotv/ascribe_detail/ikonotv_piece_container';
import IkonotvContractNotifications from './components/ikonotv/ikonotv_contract_notifications';

import CCRegisterPiece from './components/cc/cc_register_piece';

import WalletApp from './wallet_app';
import AppConstants from '../../../constants/application_constants';


let baseUrl = AppConstants.baseUrl;

let ROUTES = {
    'cyland': (
        <Route path={baseUrl} component={WalletApp}>
            <Route path={baseUrl} component={CylandLanding} />
            <Route path="login" component={LoginContainer} />
            <Route path="logout" component={LogoutContainer} />
            <Route path="signup" component={SignupContainer} />
            <Route path="password_reset" component={PasswordResetContainer} />
            <Route path="register_piece" component={CylandRegisterPiece} headerTitle="+ NEW WORK" />
            <Route path="collection" component={CylandPieceList} headerTitle="COLLECTION" />
            <Route path="pieces/:pieceId" component={CylandPieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="settings" component={SettingsContainer} />
            <Route path="contract_settings" component={ContractSettings} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    ),
    'cc': (
        <Route path={baseUrl} component={WalletApp}>
            <Route path="login" component={LoginContainer} />
            <Route path="logout" component={LogoutContainer} />
            <Route path="signup" component={SignupContainer} />
            <Route path="password_reset" component={PasswordResetContainer} />
            <Route path="register_piece" component={CCRegisterPiece} headerTitle="+ NEW WORK" />
            <Route path="collection" component={PieceList} headerTitle="COLLECTION" />
            <Route path="pieces/:pieceId" component={PieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="settings" component={SettingsContainer} />
            <Route path="*" component={ErrorNotFoundPage} />
        </Route>
    ),
    'ikonotv': (
        <Route path={baseUrl} component={WalletApp}>
            <Route path={baseUrl} component={IkonotvLanding} />
            <Route path="login" component={LoginContainer} />
            <Route path="logout" component={LogoutContainer} />
            <Route path="signup" component={SignupContainer} />
            <Route path="password_reset" component={PasswordResetContainer} />
            <Route path="request_loan" component={IkonotvRequestLoan} headerTitle="SEND NEW CONTRACT" aclName="acl_create_contractagreement" />
            <Route path="register_piece" component={IkonotvRegisterPiece} headerTitle="+ NEW WORK" aclName="acl_create_piece"/>
            <Route path="collection" component={IkonotvPieceList} headerTitle="COLLECTION"/>
            <Route path="pieces/:pieceId" component={IkonotvPieceContainer} />
            <Route path="editions/:editionId" component={EditionContainer} />
            <Route path="verify" component={CoaVerifyContainer} />
            <Route path="settings" component={SettingsContainer} />
            <Route path="contract_settings" component={ContractSettings} />
            <Route path="contract_notifications" component={IkonotvContractNotifications} />
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