import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import PieceContainer from './components/piece_container';

let Route = Router.Route;


let routes = (
    <Route name="app" path="/" handler={AscribeApp}>
        <Route name="pieces" path="/pieces" handler={PieceList}>
            
        </Route>
        <Route name="piece" path="/pieces/:pieceId" handler={PieceContainer}>
        </Route>
    </Route>
);

export default routes;
