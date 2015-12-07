'use strict';

import React from 'react';

import { getLangText } from '../utils/lang_utils';


let ErrorNotFoundPage = React.createClass({
    propTypes: {
        message: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            message: getLangText("Oops, the page you are looking for doesn't exist.")
        };
    },

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="error-wrapper">
                        <h1>404</h1>
                        <p>
                            {this.props.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});

export default ErrorNotFoundPage;