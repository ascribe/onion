'use strict';

import React from 'react';
import Router from 'react-router';

import HelloApp from './components/hello_app';
import ArtworkList from './components/artwork_list';

var Route = Router.Route;

var routes = (
  <Route handler={HelloApp}>
    <Route path="artworks" handler={ArtworkList}/>
  </Route>
);

Router.run(routes, Router.HashLocation, (HelloApp) => {
  React.render(
  	<HelloApp />,
  	document.getElementById('main')
  );
});
