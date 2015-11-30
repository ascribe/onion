'use strict';

function _transformErrorsListToHashMap(errors) {
    return errors.reduce((errObj, { error, handler }) => {
        const errorName = error.name;
        if(!errObj[errorName]) {
            errObj[errorName] = {
                error: error,
                handler: handler
            };
            return errObj;
        } else {
            throw new Error('You\'re trying to override the error handler for ' + errorName + ' by specifying it twice.');
        }
    }, {});
}

export function ReactError({ render, params, errors }) {
    errors = _transformErrorsListToHashMap(errors);
    try {
        // use react's render function + parameters to render
        // the application
        render(...params);
    } catch(err) {
        const potErrorRoutine = errors[err.name];
        if(potErrorRoutine) {
            potErrorRoutine.handler(err);
        } else {
            console.error(err.stack);
        }
    }
}

// Followed: http://stackoverflow.com/a/32749533/1263876 for extending errors
export class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name);
    }
}