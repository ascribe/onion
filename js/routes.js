import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import PieceList from './components/piece_list';
import Piece from './components/piece';

var Route = Router.Route;

var routes = (
    <Route name="app" path="/" handler={AscribeApp}>
        <Route name="pieces" handler={PieceList} />
            <Route name="piece" path="/artworks/:bitcoin_ID_noPrefix" handler={Piece} />
    </Route>
);

export default routes;
