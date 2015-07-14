'use strict';

import React from 'react';
import Router from 'react-router';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

let Link = Router.Link;

let Landing = React.createClass({
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 wp-landing-wrapper">
                        <h1>Sluice Art Prize 2015</h1>
                        <p>
                            This is the submission page for sluice art fair price 2015.
                        </p>
                        <ButtonGroup className="enter" bsSize="large" vertical block>
                            <ButtonLink to="signup">
                                Signup to the prize
                            </ButtonLink>

                            <p>
                                or, already an ascribe user?
                            </p>
                            <ButtonLink to="login">
                                Login with ascribe
                            </ButtonLink>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        );
    }
});

export default Landing;
