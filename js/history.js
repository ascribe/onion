'use strict';

import useBasename from 'history/lib/useBasename';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import AppConstants from './constants/application_constants';


// Remove the trailing slash if present
const baseUrl = AppConstants.baseUrl.replace(/\/$/, '');

const history = useBasename(createBrowserHistory)({
    basename: baseUrl
});

history.locationQueue = [];

export default history;
