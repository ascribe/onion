'use strict';

import React from 'react';


let ErrorNotFoundPage = React.createClass({
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="error-wrapper">
                        <h1>404</h1>
                        <p>
                            Ups, the page you are looking for does not exist.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});

export default ErrorNotFoundPage;