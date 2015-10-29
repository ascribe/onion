'use strict';

import { sanitize } from '../utils/general_utils';

/**
 * A tiny wrapper around HTML5's `webStorage`,
 * to enable saving JSON objects directly into `webStorage`
 */
export default class AscribeStorage {
    /**
     * @param  {String} `name` A unique storage name
     */
    constructor(type, name) {
        if(type === 'localStorage' || type === 'sessionStorage') {
            this.storage = window[type];
        } else {
            throw new Error('"type" can only be either "localStorage" or "sessionStorage"');
        }

        this.name = name;
    }

    /**
     * Private method, do not use from the outside.
     * Constructs a unique identifier for a item in the global `webStorage`,
     * by appending the `ÀscribeStorage`'s name
     * @param  {string} key A unique identifier
     * @return {string}     A globally unique identifier for a value in `webStorage`
     */
    _constructStorageKey(key) {
        return `${this.name}-${key}`;
    }

    _deconstructStorageKey(key) {
        return key.replace(`${this.name}-`, '');
    }

    /**
     * Saves a JSON-serializeble object or a string into `webStorage`
     * @param {string} key   Used as a unique identifier
     * @param {oneOfType([String, object])} value Either JSON-serializeble or a string
     */
    setItem(key, value) {
        // We're "try-catching" errors in this method ourselves, to be able to
        // yield more readable error messages

        if(!key || !value) {
            throw new Error('"key" or "value" cannot be "falsy" values');
        } else if(typeof value === 'string') {
            // since `value` is a string, we can directly write
            // it into `this.storage`
            this.storage.setItem(this._constructStorageKey(key), value);
        } else {
            // if `value` is not a string, we need to JSON-serialize it and then
            // put it into `this.storage`

            let serializedValue;
            try {
                serializedValue = JSON.stringify(value);
            } catch(err) {
                throw new Error('You didn\'t pass valid JSON as "value" into setItem.');
            }

            try {
                this.storage.setItem(this._constructStorageKey(key), serializedValue);
            } catch(err) {
                throw new Error('Failure saving a "serializedValue" in setItem');
            }
        }
    }

    getItem(key) {
        let deserializedValue;
        const serializedValue = this.storage.getItem(this._constructStorageKey(key));

        try {
            deserializedValue = JSON.parse(serializedValue);
        } catch(err) {
            deserializedValue = serializedValue;
        }

        return deserializedValue;
    }

    toObject() {
        let obj = {};
        const storageCopy = JSON.parse(JSON.stringify(this.storage));
        const sanitizedStore = sanitize(storageCopy, s => !s.match(`${this.name}-`), true);
        
        Object
            .keys(sanitizedStore)
            .forEach((key) => {
                obj[this._deconstructStorageKey(key)] = JSON.parse(sanitizedStore[key]);
            });

        return obj;
    }
}