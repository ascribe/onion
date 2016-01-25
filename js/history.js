'use strict';

import { useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import AppConstants from './constants/application_constants';


const history = useRouterHistory(createBrowserHistory)({
    basename: AppConstants.baseUrl
});

history.locationQueue = [];

export default history;
