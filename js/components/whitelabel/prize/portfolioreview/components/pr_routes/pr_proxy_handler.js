'use strict';

import history from '../../../../../../history';


export function AuthPrizeRoleRedirect({ to, when }) {
    if (when.constructor !== Array || !when.length) {
        throw new Error('`when` of AuthPrizeRoleRedirect must be an array containing values');
    }
    if (!to || to.indexOf('/') === -1) {
        throw new Error('`to` of AuthPrizeRoleRedirect must be defined and contain a valid route');
    }

    return function(currentUser, query) {
        const exprToValidate = when
            .map(role => currentUser[role])
            .reduce((a, b) => a || b);

        if (exprToValidate) {
            window.setTimeout(() => history.replace({ pathname: to, query: query }));
            return true;
        } else {
            return false;
        }
    };
}
