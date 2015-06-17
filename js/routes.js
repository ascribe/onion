'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import EditionContainer from './components/edition_container';
import PasswordResetContainer from './components/password_reset_container';
import AppConstants from './constants/application_constants';
import RegisterPiece from './components/register_piece';
//import LoginModalHandler from './components/login_modal_handler';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


let routes = (
    <Route name="app" path={baseUrl} handler={AscribeApp}>
        <Route name="pieces" path="collection" handler={PieceList} />
        <Route name="edition" path="editions/:editionId" handler={EditionContainer} />
        <Route name="password_reset" path="password_reset" handler={PasswordResetContainer} />
        <Route name="register_piece" path="register_piece" handler={RegisterPiece} />

        <Redirect from={baseUrl} to="pieces" />
        <Redirect from={baseUrl + '/'} to="pieces" />
    </Route>
);

export default routes;
