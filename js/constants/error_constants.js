'use strict'

import { deepMatchObject } from '../utils/general_utils';
import { getLangText } from '../utils/lang_utils';

/**
 * ErrorClasses
 * ============
 * Known error classes based on groupings (ie. where they happened, which component, etc).
 *
 * Error classes have a test object that can be used to test whether or not an error
 * object matches that specific class. Properties in the test object will be recursively
 * checked in the error object, and the error object is only matched to the class if all
 * tests succeed. See testErrorAgainstClass() below for the implementation of the matching.
 *
 * ErrorClasses.default.default is the generic error for errors not identified under any
 * grouping and class.
 *
 * Format:
 * ErrorClasses = {
 *     'errorGrouping': {
 *         'errorClassName': ErrorClass
 *         ...
 *      },
 *      ...
 *      'default': {
 *          ...
 *          'default': generic error for errors that don't fall under any grouping and class
 *      }
 * }
 *
 * Each class is of the format:
 * ErrorClass = {
 *     'name': name of the class
 *     'group': grouping of the error,
 *     'prettifiedText': prettified text for the class
 *     'test': {
 *         prop1: property in the error object to recursively match against using
 *                either === or, if the property is a string, substring match
 *                (ie. indexOf() >= 0)
 *         ...
 *     },
 * }
 *
 * Test object examples
 * ====================
 * A class like this:
 *
 *     'errorClass': {
 *         'test': {
 *             'reason': 'Invalid server response',
 *             'xhr': {
 *                 'response': 'Internal error',
 *                 'status': 500
 *             }
 *         }
 *     }
 *
 * will match this error object:
 *
 *     error = {
 *         'reason': 'Invalid server response',
 *         'xhr': {  // Simplified version of the XMLHttpRequest object responsible for the failure
 *             'response': 'Internal error',
 *             'status': 500
 *         }
 *     }
 *
 * but will *NOT* match this error object:
 *
 *     error = {
 *         'reason': 'Invalid server response',
 *         'xhr': {
 *             'response': 'Unauthorized',
 *             'status': 401
 *         }
 *     }
 *
 * A common use case is for the test to just be against the error.reason string.
 * In these cases, setting the test object to be just a string will enforce this test,
 * so something like this:
 *
 *     'errorClass': {
 *         'test': {
 *             'reason': 'Invalid server response'
 *         }
 *     }
 *
 * is the same as:
 *
 *     'errorClass': {
 *         'test': 'Invalid server response'
 *     }
 */
const ErrorClasses = {
    'upload': {
        'requestTimeTooSkewed': {
            'prettifiedText': getLangText('It appears that the time set on your computer is too ' +
                                          'inaccurate compared to your current local time. As a security ' +
                                          'measure, we check to make sure that our users are not falsifying ' +
                                          "their registration times. Please synchronize your computer's " +
                                          'clock and try again.'),
            'test': {
                'xhr': {
                    'response': 'RequestTimeTooSkewed'
                }
            }
        },
        'chunkSignatureError': {
            'prettifiedText': getLangText('We are experiencing some problems with uploads at the moment and ' +
                                          'are working to resolve them. Please try again in a few hours.'),
            'test': 'Problem signing the chunk'
        },

        // Fallback error tips
        'slowConnection': {
            'prettifiedText': getLangText('Are you on a slow or unstable network? Uploading large files requires a fast Internet connection.')
        },
        'tryDifferentBrowser': {
            'prettifiedText': getLangText("We still can't seem to upload your file. Maybe try another browser?")
        },
        'contactUs': {
            'prettifiedText': getLangText("We're having a really hard time with your upload. Please contact us for more help.")
        }
    },
    'default': {
        'default': {
            'prettifiedText': getLangText("It looks like there's been a problem on our end. If you keep experiencing this error, please contact us.")
        }
    }
};

// Dynamically inject the name and group properties into the classes
Object.keys(ErrorClasses).forEach((errorGroupKey) => {
    const errorGroup = ErrorClasses[errorGroupKey];
    Object.keys(errorGroup).forEach((errorClassKey) => {
        const errorClass = errorGroup[errorClassKey];
        errorClass.name = errorClassKey;
        errorClass.group = errorGroupKey;
    });
});

/**
 * Returns prettified text for a given error by trying to match it to
 * a known error in ErrorClasses or the given class.
 *
 * One should provide a class (eg. ErrorClasses.upload.requestTimeTooSkewed)
 * if they already have an error in mind that they want to match against rather
 * than all the available error classes.
 *
 * @param  {object} error                  An error with the following:
 * @param  {string} error.type                 Type of error
 * @param  {string} error.reason               Reason of error
 * @param  {(XMLHttpRequest)} error.xhr        XHR associated with the error
 * @param  {(any)}  error.*                    Any other property as necessary
 *
 * @param  {(object)} errorClass           ErrorClass to match against the given error.
 *                                         Signature should be similar to ErrorClasses' classes (see above).
 * @param  {object|string} errorClass.test     Test object to recursively match against the given error
 * @param  {string} errorClass.prettifiedText  Prettified text to return if the test matches
 *
 * @return {string}                        Prettified error string. Returns the default error string if no
 *                                         error class was matched to the given error.
 */
function getPrettifiedError(error, errorClass) {
    const matchedClass = errorClass ? testErrorAgainstClass(error, errorClass) : testErrorAgainstAll(error);
    return (matchedClass && matchedClass.prettifiedText) || ErrorClasses.default.default.prettifiedText;
}

/**
 * Tests the given error against all items in ErrorClasses and returns
 * the matching class if available.
 * See getPrettifiedError() for the signature of @param error.
 * @return {(object)} Matched error class
 */
function testErrorAgainstAll(error) {
    const type = error.type != null ? error.type : 'default';
    const errorGroup = ErrorClasses[type];

    return Object
            .keys(errorGroup)
            .reduce((result, key) => {
                return result || testErrorAgainstClass(error, errorGroup[key]);
            }, null);
}

/**
 * Tests the error against the class by recursively testing the
 * class's test object against the error.
 * Implements the test matching behaviour described in ErrorClasses.
 *
 * See getPrettifiedError() for the signatures of @param error and @param errorClass.
 * @return {(object)} Returns the given class if the test succeeds.
 */
function testErrorAgainstClass(error, errorClass) {
    // Automatically fail classes if no tests present
    if (!errorClass.test) {
        return;
    }

    if (typeof errorClass.test === 'string') {
        errorClass.test = {
            reason: errorClass.test
        };
    }

    return deepMatchObject(error, errorClass.test, (objProp, matchProp) => {
        return (objProp === matchProp || (typeof objProp === 'string' && objProp.indexOf(matchProp) >= 0));
    }) ? errorClass : null;
}

// Need to export with the clause syntax as we change ErrorClasses after its declaration.
export {
    ErrorClasses,
    getPrettifiedError,
    testErrorAgainstAll,
    testErrorAgainstClass
};
