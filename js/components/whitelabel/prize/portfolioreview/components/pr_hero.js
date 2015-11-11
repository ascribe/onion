'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';


const PRHero = React.createClass({
    render() {
        return (
            <div className="piece--hero">
                <h2><Glyphicon glyph="ok" /> Congratulations!</h2>
                <h1>You have successfully submitted to Portfolio Review 2016</h1>
                <p>See below, your uploaded portfolio:</p>
            </div>
        );
    }
});

export default PRHero;