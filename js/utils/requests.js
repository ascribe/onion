'use strict';

import Q from 'q';

import { argsToQueryParams, getCookie } from '../utils/fetch_api_utils';

import AppConstants from '../constants/application_constants';

import {excludePropFromObject} from '../utils/general_utils';

class Requests {
    _merge(defaults, options) {
        let merged = {};
        for (let key in defaults) {
            merged[key] = defaults[key];
        }
        for (let key in options) {
            merged[key] = options[key];
        }
        return merged;
    }

    unpackResponse(response) {
        if (response.status >= 500) {
            throw new Error(response.status + ' - ' + response.statusText + ' - on URL:' + response.url);
        }

        return Q.Promise((resolve, reject) => {
            response.text()
                .then((responseText) => {
                    // If the responses' body does not contain any data,
                    // fetch will resolve responseText to the string 'None'.
                    // If this is the case, we can not try to parse it as JSON.
                    if(responseText !== 'None') {
                        let body = JSON.parse(responseText);
                        
                        if(body && body.errors) {
                            let error = new Error('Form Error');
                            error.json = body;
                            reject(error);
                        } else if(body && body.detail) {
                            reject(new Error(body.detail));
                        } else {
                            resolve(body);
                        }

                    } else {
                        if(response.status >= 400) {
                            reject(new Error(response.status + ' - ' + response.statusText + ' - on URL:' + response.url));
                        } else {
                            resolve({});
                        }
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
    }

    handleError(err) {
        if (err instanceof TypeError) {
            throw new Error('Server did not respond to the request. (Not even displayed a 500)');
        } else {
            throw err;
        }
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

    request(verb, url, options) {
        options = options || {};
        let merged = this._merge(this.httpOptions, options);
        let csrftoken = getCookie(AppConstants.csrftoken);
        if (csrftoken) {
            merged.headers['X-CSRFToken'] = csrftoken;
        }
        merged.method = verb;

        return fetch(url, merged)
                    .then(this.unpackResponse)
                    .catch(this.handleError);
    }

    get(url, params) {
        if (url === undefined){
            throw new Error('Url undefined');
        }
        let paramsCopy = this._merge(params);
        let newUrl = this.prepareUrl(url, paramsCopy, true);
        return this.request('get', newUrl);
    }

    delete(url, params) {
        let paramsCopy = this._merge(params);
        let newUrl = this.prepareUrl(url, paramsCopy, true);
        return this.request('delete', newUrl);
    }

    _putOrPost(url, paramsAndBody, method){
        let paramsCopy = this._merge(paramsAndBody);
        let params = excludePropFromObject(paramsAndBody,['body']);

        let newUrl = this.prepareUrl(url, params);
        let body = null;
        if (paramsCopy && paramsCopy.body) {
            console.log(paramsCopy.body);
            body = JSON.stringify(paramsCopy.body);
        }
        return this.request(method, newUrl, { body });
    }

    post(url, params) {
        return this._putOrPost(url,params,'post')
    }

    put(url, params){
        return this._putOrPost(url,params,'put')
    }

    defaults(options) {
        this.httpOptions = options.http || {};
        this.urlMap = options.urlMap || {};
    }
}


let requests = new Requests();

export default requests;
