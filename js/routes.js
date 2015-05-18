import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import ArtworkList from './components/gui/artwork_list';

var Route = Router.Route;

var routes = (
  <Route handler={AscribeApp}>
    <Route path="artworks" handler={ArtworkList} />
  </Route>
);

export default routes;