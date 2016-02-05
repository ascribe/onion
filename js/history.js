'use strict';

import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import AppConstants from './constants/application_constants';


// Remove the trailing slash if present
const baseUrl = AppConstants.baseUrl.replace(/\/$/, '');

const history = useBasename(useQueries(createBrowserHistory))({
    basename: baseUrl
});

history.locationQueue = [];

export default history;
