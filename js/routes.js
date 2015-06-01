import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import EditionContainer from './components/edition_container';

let Route = Router.Route;


let routes = (
    <Route name="app" handler={AscribeApp}>
        <Route name="pieces" path="/" handler={PieceList}>
            
        </Route>
        <Route name="edition" path="/editions/:editionId" handler={EditionContainer}>
        </Route>
    </Route>
);

export default routes;
