'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import EditionContainer from './components/edition_container';

import AppConstants from './constants/application_constants';

let Route = Router.Route;
let Redirect = Router.Redirect;
let baseUrl = AppConstants.baseUrl;


let routes = (
    <Route name="app" path={baseUrl} handler={AscribeApp}>
        <Route name="pieces" path="collection" handler={PieceList} />
        <Route name="edition" path="editions/:editionId" handler={EditionContainer} />

        <Redirect from={baseUrl} to="pieces" />
        <Redirect from={baseUrl + '/'} to="pieces" />
    </Route>
);

export default routes;
