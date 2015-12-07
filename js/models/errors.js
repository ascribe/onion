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
        const { displayName } = component.constructor;
        const monkeyPatchedKey = typeof displayName === 'string' ? `_${displayName}MonkeyPatched`
                                                                 : '_monkeyPatched';

        if(!component.state[monkeyPatchedKey]) {
            component.render = () => <ErrorNotFoundPage message={err.message} />;
            component.setState({
                [monkeyPatchedKey]: true
            });
        }
    }
}
