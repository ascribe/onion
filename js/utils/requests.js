'use strict';

import Q from 'q';

import AppConstants from '../constants/application_constants';

import { getCookie } from '../utils/fetch_api_utils';
import { omitFromObject } from '../utils/general_utils';
import { argsToQueryParams } from '../utils/url_utils';


class Requests {
    unpackResponse(url) {
        return (response) => {
            if (response == null) {
                throw new Error(`For: ${url} - Server did not respond to the request. (Not even displayed a 500)`);
            }

            if (response.status >= 500) {
                let err = new Error(`${response.status} - ${response.statusText} - on URL: ${response.url}`);

                return response
                    .text()
                    .then((resText) => {
                        const resJson = JSON.parse(resText);
                        err = new Error(resJson.errors.pop());

                        // ES6 promises don't have a .finally() clause so we fake that here by
                        // forcing the .catch() clause to run
                        return Promise.reject();
                    })
                    // If parsing the resText throws, just rethrow the original error we created
                    .catch(() => { throw err; });
            }

            return Q.Promise((resolve, reject) => {
                response.text()
                    .then((responseText) => {
                        // If the responses' body does not contain any data,
                        // fetch will resolve responseText to the string 'None'.
                        // If this is the case, we can not try to parse it as JSON.
                        if (responseText && responseText !== 'None') {
                            const body = JSON.parse(responseText);

                            if (body && body.errors) {
                                const error = new Error('Form Error');
                                error.json = body;
                                reject(error);
                            } else if (body && body.detail) {
                                reject(new Error(body.detail));
                            } else if (body && 'success' in body && !body.success) {
                                const error = new Error('Client Request Error');
                                error.json = {
                                    body: body,
                                    status: response.status,
                                    statusText: response.statusText,
                                    type: response.type,
                                    url: response.url
                                };
                                reject(error);
                            } else {
                                resolve(body);
                            }
                        } else if (response.status >= 400) {
                            reject(new Error(`${response.status} - ${response.statusText} - on URL: ${response.url}`));
                        } else {
                            resolve({});
                        }
                    }).catch(reject);
            });
        };
    }

    getUrl(url) {
        // Handle case, that the url string is not defined at all
        if (!url) {
            throw new Error('Url was not defined and could therefore not be mapped.');
        }

        let name = url;
        if (!url.match(/^http/)) {
            url = this.urlMap[url];
            if (!url) {
                throw new Error(`Cannot find a mapping for "${name}"`);
            }
        }
        return url;
    }

    prepareUrl(url, params, attachParamsToQuery) {
        let newUrl;
        let re = /\${(\w+)}/g;

        // catch errors and throw them to react
        try {
            newUrl = this.getUrl(url);
        } catch(err) {
            throw err;
        }

        newUrl = newUrl.replace(re, (match, key) => {
            let val = params[key];
            if (!val) {
                throw new Error(`Cannot find param ${key}`);
            }
            delete params[key];
            return val;
        });

        if (attachParamsToQuery && params && Object.keys(params).length > 0) {
            newUrl += argsToQueryParams(params);
        }

        return newUrl;
    }

    request(verb, url, options = {}) {
        let merged = Object.assign({}, this.httpOptions, options);
        let csrftoken = getCookie(AppConstants.csrftoken);
        if (csrftoken) {
            merged.headers['X-CSRFToken'] = csrftoken;
        }
        merged.method = verb;
        return fetch(url, merged)
                    .then(this.unpackResponse(url));
    }

    get(url, params) {
        if (url === undefined) {
            throw new Error('Url undefined');
        }
        let paramsCopy = Object.assign({}, params);
        let newUrl = this.prepareUrl(url, paramsCopy, true);
        return this.request('get', newUrl);
    }

    delete(url, params) {
        let paramsCopy = Object.assign({}, params);
        let newUrl = this.prepareUrl(url, paramsCopy, true);
        return this.request('delete', newUrl);
    }

    _putOrPost(url, paramsAndBody, method) {
        let params = omitFromObject(paramsAndBody, ['body']);
        let newUrl = this.prepareUrl(url, params);
        let body = paramsAndBody && paramsAndBody.body ? JSON.stringify(paramsAndBody.body)
                                                       : null;
        return this.request(method, newUrl, { body });
    }

    post(url, params) {
        return this._putOrPost(url, params, 'post');
    }

    put(url, params) {
        return this._putOrPost(url, params, 'put');
    }

    patch(url, params) {
        return this._putOrPost(url, params, 'patch');
    }

    defaults(options) {
        this.httpOptions = options.http || {};
        this.urlMap = options.urlMap || {};
    }
}


let requests = new Requests();

export default requests;
