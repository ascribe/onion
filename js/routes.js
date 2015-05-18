import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import ArtworkList from './components/artwork_list';

var Route = Router.Route;

var routes = (
    <Route name="app" path="/" handler={AscribeApp}>
        <Route name="artworks" handler={ArtworkList} />
    </Route>
);

export default routes;
