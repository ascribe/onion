'use strict';

import React from 'react';
import { History } from 'react-router';

import { getLangText } from '../utils/lang_utils';


let ErrorNotFoundPage = React.createClass({
    propTypes: {
        message: React.PropTypes.string,

        // Provided from AscribeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    mixins: [History],

    getDefaultProps() {
        return {
            message: getLangText("Oops, the page you are looking for doesn't exist.")
        };
    },

    componentDidMount() {
        // The previous page, if any, is the second item in the locationQueue
        const { locationQueue: [ , previousPage ] } = this.history;

        if (previousPage) {
            console.logGlobal('Page not found', {
                previousPath: previousPage.pathname
            });
        }
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
