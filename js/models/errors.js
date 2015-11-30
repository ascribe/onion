'use strict';

import React from 'react';

import ErrorNotFoundPage from '../components/error_not_found_page';


export class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name);
    }

    handler(component, err) {
        if(!component.state._monkeyPatched) {
            component.render = () => <ErrorNotFoundPage message={err.message} />;
            component.setState({
                _monkeyPatched: true
            });
        }
    }
}
