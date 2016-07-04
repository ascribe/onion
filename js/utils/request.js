import { request as baseRequest, sanitize } from 'js-utility-belt/es6';

import { makeCsrfHeader } from './csrf';
import { resolveUrl } from './url_resolver';


const DEFAULT_REQUEST_CONFIG = {
    credentials: 'include',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

/**
 * Small wrapper around js-utility-belt's request that provides default settings, url mapping, and
 * response handling.
 */
export default function request(url, config) {
    // Load default fetch configuration and remove any falsy query parameters
    const requestConfig = Object.assign({}, DEFAULT_REQUEST_CONFIG, config, config && {
        query: config.query && sanitize(config.query)
    });

    // Add CSRF token
    Object.assign(requestConfig.headers, makeCsrfHeader());

    // Resolve url and send request
    return new Promise((resolve) => {
        resolve(resolveUrl(url));
    })
        .then((apiUrl) => (
            baseRequest(apiUrl, requestConfig)
                // Catch any errors resulting from baseRequest first
                .catch((err) => {
                    if (err == null) {
                        throw new Error(`For: ${apiUrl} - Server did not respond to the request. ` +
                                        '(Not even displayed a 500)');
                    } else if (err instanceof Response) {
                        const res = err;
                        let responseErr = new Error(
                            `${res.status} - ${res.statusText} - on URL: ${res.url}`
                        );

                        // Try to parse the response body to see if we added more descriptive errors
                        // before rejecting with the error above.
                        return res
                            .json()
                            .then((body) => {
                                if (body && Array.isArray(body.errors) && body.errors.length) {
                                    responseErr = new Error(body.errors.pop());
                                }

                                // ES6 promises don't have a .finally() clause so we fake that here
                                // by forcing the .catch() clause to run
                                return Promise.reject();
                            })
                            // If parsing the response body throws, just rethrow the original
                            // response error
                            .catch(() => { throw responseErr; });
                    } else {
                        // Just rethrow the error since it's not a Response
                        throw err;
                    }
                })
                // Handle successful requests
                .then((res) => res
                    .json()
                    .then((body) => {
                        if (body) {
                            let error;

                            if (body.errors) {
                                error = new Error('Form Error');
                                error.json = body;
                            } else if (body.detail) {
                                error = Error(body.detail);
                            } else if ('success' in body && !body.success) {
                                const { status, statusText, type, url: resUrl } = res;

                                error = new Error('Client Request Error');
                                error.json = { body, status, statusText, type, url: resUrl };
                            }

                            if (error) {
                                throw error;
                            } else {
                                return body;
                            }
                        } else {
                            return {};
                        }
                    })
                )
        ))
        // Log any errors and rethrow
        .catch((err) => {
            console.error(err);
            throw err;
        });
}
