'use strict';

import React from 'react';
import Router from 'react-router';
import constants from '../../../../constants/application_constants';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';


let Landing = React.createClass({
    render() {
        return (
            <div>
                <div className="hero">
                    <img className="logo" src={constants.whitelabel.logo} alt="Sluice Art Prize" />
                    <h1>Sluice Art Prize 2015</h1>
                </div>

                <div className="container">
                    <ButtonGroup className="enter" bsSize="large" vertical block>
                        <ButtonLink to="signup">
                            Signup
                        </ButtonLink>

                        <ButtonLink to="login">
                            Login
                        </ButtonLink>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
});

export default Landing;
