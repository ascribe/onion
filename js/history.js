'use strict';

import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import AppConstants from './constants/application_constants';


// Remove the trailing slash if present
let baseUrl = AppConstants.baseUrl.replace(/\/$/, '');

export default useBasename(useQueries(createBrowserHistory))({
    basename: baseUrl
});
