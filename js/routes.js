import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import ArtworkList from './components/artwork_list';
import Artwork from './components/artwork';

var Route = Router.Route;

var routes = (
    <Route name="app" path="/" handler={AscribeApp}>
        <Route name="artworks" handler={ArtworkList} />
            <Route name="artwork" path="/artworks/:bitcoin_ID_noPrefix" handler={Artwork} />
    </Route>
);

export default routes;
