'use strict';

import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import AppConstants from './constants/application_constants';


const history = useBasename(useQueries(createBrowserHistory))({
    basename: AppConstants.baseUrl
});

history.locationQueue = [];

export default history;
