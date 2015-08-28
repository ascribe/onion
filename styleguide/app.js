'use strict';

import React from 'react';
import Buttons from './components/buttons';
import Panel from 'react-bootstrap/lib/Panel';


React.render(
    <div className="container">
        <h3>Buttons</h3>
        <Buttons />
    </div>,
    document.getElementById('main')
);
