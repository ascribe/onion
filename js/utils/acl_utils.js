'use strict';

import { sanitize } from './general_utils';

export function intersectAcls(a, b) {
    return a.filter((val) => b.indexOf(val) > -1);
}

export function getAvailableAcls(editions, filterFn) {
    let availableAcls = [];
    if (!editions || editions.constructor !== Array){
        return [];
    }
    // if you copy a javascript array of objects using slice, then
    // the object reference is still there.
    // Therefore we need to do this ugly copying
    let editionsCopy = JSON.parse(JSON.stringify(editions));

    // sanitize object acls in editions
    // so that they don't contain any falsy key-value pairs anymore
    editionsCopy = editionsCopy.map((edition) => {
        // acl also returns the piece id and the edition id
        // therefore, we're going to remove it
        edition.acl.edition = false;
        edition.acl.piece = false;

        edition.acl = sanitize(edition.acl, (val) => !val);
        edition.acl = Object.keys(edition.acl);

        // additionally, the user can specify a filter function for
        // an acl array
        if(typeof filterFn === 'function') {
            edition.acl = edition.acl.filter(filterFn);
        }

        return edition;
    });

    // If no edition has been selected, availableActions is empty
    // If only one edition has been selected, their actions are available
    // If more than one editions have been selected, their acl properties are intersected
    if(editionsCopy.length >= 1) {
        availableAcls = editionsCopy[0].acl;
    }
    if(editionsCopy.length >= 2) {
        for(let i = 1; i < editionsCopy.length; i++) {
            availableAcls = intersectAcls(availableAcls, editionsCopy[i].acl);
        }
    }

    // convert acls back to key-value object
    let availableAclsObj = {};
    for(let i = 0; i < availableAcls.length; i++) {
        availableAclsObj[availableAcls[i]] = true;
    }


    return availableAclsObj;
}