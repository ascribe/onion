'use strict';

import React from 'react';

import ErrorNotFoundPage from '../components/error_not_found_page';


export class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;

        // `captureStackTrace` might not be available in IE:
        // - http://stackoverflow.com/a/8460753/1263876
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor.name);
        }
    }

    handler(component, err) {
        const monkeyPatchedKey = `_${this.name}MonkeyPatched`;

        if(!component.state[monkeyPatchedKey]) {
            component.render = () => <ErrorNotFoundPage message={err.message} />;
            component.setState({
                [monkeyPatchedKey]: true
            });
        }
    }
}
