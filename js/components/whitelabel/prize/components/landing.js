'use strict';

import React from 'react';
import Router from 'react-router';

let Link = Router.Link;


let Landing = React.createClass({
    render() {
        return (
            <div>
                <div class="hero">
                    Yay art prize!
                </div>

                <div class="buttons">
                    <Link to="login">Login</Link>
                    <Link to="signup">Signup</Link>
                </div>
            </div>
        );
    }
});

export default Landing;
