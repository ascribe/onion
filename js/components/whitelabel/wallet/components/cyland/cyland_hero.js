'use strict';

import React from 'react';
import AppConstants from '../../../../constants/application_constants';


let Hero = React.createClass({
    render() {
        return (
            <div className="hero">
                <img
                    className="logo" src={AppConstants.whitelabel.logo}
                    alt="Cyland Video Archive"
                    height="200px"/>
            </div>
        );
    }
});

export default Hero;
