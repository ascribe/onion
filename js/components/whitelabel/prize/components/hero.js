'use strict';

import React from 'react';
import constants from '../../../../constants/application_constants';


let Hero = React.createClass({
    render() {
        return (
            <div className="hero">
                <img className="logo" src={constants.whitelabel.logo} alt="Sluice Art Prize" />
                <h1>Sluice Art Prize 2015</h1>
            </div>
        );
    }
});

export default Hero;
