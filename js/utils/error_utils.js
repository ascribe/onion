'use strict';

import AppConstants from '../constants/application_constants';

/**
 * Logs an error in to the console.
 * Optionally, a comment can be defined.
 * @param  {Error} error    a Javascript error
 * @param  {string} comment  Will also be submitted to Sentry, but will not be logged
 */
function logGlobal(error, comment) {
    console.error(error);

    if (error.hasOwnProperty('json')) {
        comment = {
            ...comment,
            json: error.json
        };
    }
}

export function initLogging() {
    console.logGlobal = logGlobal;
}

/*
 * Gets the json errors from the error as an array
 * @param  {Error} error A Javascript error
 * @return {Array}       List of json errors
 */
export function getJsonErrorsAsArray(error) {
    const { json: { errors = {} } = {} } = error;

    const errorArrays = Object
        .keys(errors)
        .map((errorKey) => {
            return errors[errorKey];
        });

    // Collapse each errorKey's errors into a flat array
    return [].concat(...errorArrays);
}

/*
 * Tries to get an error message from the error, either by using its notification
 * property or first json error (if any)
 * @param  {Error} error A Javascript error
 * @return {string}      Error message string
 */
export function getErrorNotificationMessage(error) {
    return (error && error.notification) || getJsonErrorsAsArray(error)[0] || '';
}
