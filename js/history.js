'use strict';

import { useRouterHistory } from 'react-router';
import { useQueries } from 'history';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import AppConstants from './constants/application_constants';


// Remove the trailing slash if present
let basename = AppConstants.baseUrl.replace(/\/$/, '');

export default useRouterHistory(useQueries(createBrowserHistory))({ basename });
