'use strict';

import AscribeStorage from '../models/ascribe_storage';


export default class SessionPersistentStore extends AscribeStorage {
    constructor(name) {
        super('sessionStorage', name);
    }

    setItem(key, value) {
        this[key] = value;
        super.setItem(key, value);
    }
}