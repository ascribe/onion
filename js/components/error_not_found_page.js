import React from 'react';

import history from '../history';

import { getLangText } from '../utils/lang_utils';


const ErrorNotFoundPage = React.createClass({
    propTypes: {
        message: React.PropTypes.string,
    },

    getDefaultProps() {
        return {
            message: getLangText("Oops, the page you are looking for doesn't exist.")
        };
    },

    componentDidMount() {
        // The previous page, if any, is the second item in the locationQueue
        const { locationQueue: [, previousPage] } = history;

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
