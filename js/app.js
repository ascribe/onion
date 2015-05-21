'use strict';

import React from 'react';
import Router from 'react-router';

import AscribeApp from './components/ascribe_app';
import routes from './routes';
import alt from './alt';


Router.run(routes, Router.HashLocation, (AscribeApp) => {
    React.render(
        <AscribeApp />,
        document.getElementById('main')
    );
});
