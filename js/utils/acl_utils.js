'use strict';

export function getAvailableAcls(editions) {
    let availableAcls = [];

    // If no edition has been selected, availableActions is empty
    // If only one edition has been selected, their actions are available
    // If more than one editions have been selected, their acl properties are intersected
    if(editions.length >= 1) {
        availableAcls = editions[0].acl;
    }
    if(editions.length >= 2) {
        for(let i = 1; i < editions.length; i++) {
            availableAcls = intersectAcls(availableAcls, editions[i].acl);
        }
    }

    return availableAcls;
}

export function intersectAcls(a, b) {
    return a.filter((val) => b.indexOf(val) > -1);
}