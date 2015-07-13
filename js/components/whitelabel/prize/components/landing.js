'use strict';

import React from 'react';
import Router from 'react-router';

import ButtonLink from 'react-router-bootstrap/lib/ButtonLink';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

let Link = Router.Link;

let Landing = React.createClass({
    render() {
        return (
            <div>
                <div className="container">
                    <ButtonGroup className="enter" bsSize="large" vertical block>
                        <ButtonLink to="signup">
                            Signup to the prize
                        </ButtonLink>

                        Already a user? <Link to="login">log in</Link>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
});

export default Landing;
