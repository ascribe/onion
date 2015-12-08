'use strict';

import invariant from 'invariant';

const ReactError = {
    throws(err) {
        if(!err.handler) {
            invariant(err.handler, 'Error thrown to ReactError did not have a `handler` function');
            console.logGlobal('Error thrown to ReactError did not have a `handler` function');
        } else {
            err.handler(this, err);
        }
    }
};

export default ReactError;
