'use strict';

import React from 'react';
import constants from '../../../../constants/application_constants';


let Hero = React.createClass({
    render() {
        return (
            <div className="hero">
                <img
                    className="logo" src={constants.whitelabel.logo}
                    alt="Sluice Art Prize"
                    height="200px"/>
            </div>
        );
    }
});

export default Hero;
