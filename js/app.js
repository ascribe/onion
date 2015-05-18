'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import routes from './routes';

Router.run(routes, Router.HistoryLocation, (AscribeApp) => {
  React.render(
  	<AscribeApp />,
  	document.getElementById('main')
  );
});
