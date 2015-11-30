'use strict';

import invariant from 'invariant';

const ReactError = {
    throws(err) {
        invariant(err.handler, 'You need to specify a `handler` for this error');
        err.handler(this, err);
    }
};

export default ReactError;
