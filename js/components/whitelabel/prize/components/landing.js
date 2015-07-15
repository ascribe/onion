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
                        <h1>Sluice_screens ↄc Prize 2015</h1>
                        <p>
                            This is the submission page for Sluice_screens ↄc Prize 2015.
                        </p>
                        <ButtonGroup className="enter" bsSize="large" vertical block>
                            <ButtonLink to="signup">
                                Sign up to submit
                            </ButtonLink>

                            <p>
                                or, already an ascribe user?
                            </p>
                            <ButtonLink to="login">
                                Log in to submit
                            </ButtonLink>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        );
    }
});

export default Landing;
