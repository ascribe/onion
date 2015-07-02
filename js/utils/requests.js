'use strict';

import { argsToQueryParams, getCookie } from '../utils/fetch_api_utils';


class UrlMapError extends Error {}
class ServerError extends Error {}
class APIError extends Error {}


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
            throw new ServerError();
        }
        return response.text();
    }

    customJSONparse(responseText) {
        // If the responses' body does not contain any data,
        // fetch will resolve responseText to the string 'None'.
        // If this is the case, we can not try to parse it as JSON.
        if(responseText !== 'None') {
            return JSON.parse(responseText);
        } else {
            return {};
        }
    }

    handleFatalError(err) {
        this.fatalErrorHandler(err);
        throw new ServerError(err);
    }

    handleAPIError(json) {
        if (json.success === false) {
            let error = new APIError();
            error.json = json;
            //console.error(new Error('The \'success\' property is missing in the server\'s response.'));
            throw error;
        }
        return json;
    }

    getUrl(url) {
        let name = url;
        if (!url.match(/^http/)) {
            url = this.urlMap[url];
            if (!url) {
                throw new UrlMapError(`Cannot find a mapping for "${name}"`);
            }
        }
        
        return url;
    }

    prepareUrl(url, params, attachParamsToQuery) {
        let newUrl = this.getUrl(url);
        let re = /\${(\w+)}/g;

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
        let csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            merged.headers['X-CSRFToken'] = csrftoken;
        }
        merged.method = verb;
        return fetch(url, merged)
                    .then(this.unpackResponse)
                    .then(this.customJSONparse)
                    .catch(this.handleFatalError.bind(this))
                    .then(this.handleAPIError);
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

    post(url, params) {
        let paramsCopy = this._merge(params);
        let newUrl = this.prepareUrl(url, paramsCopy);
        let body = null;

        if (paramsCopy && paramsCopy.body) {
            body = JSON.stringify(paramsCopy.body);
        }
        return this.request('post', newUrl, { body });
    }

    defaults(options) {
        this.httpOptions = options.http || {};
        this.urlMap = options.urlMap || {};
        this.fatalErrorHandler = options.fatalErrorHandler || (() => {});
    }
}


let requests = new Requests();

export default requests;
