import useRouterHistory from 'react-router/es6/useRouterHistory';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import AppConstants from './constants/application_constants';


const history = useRouterHistory(createBrowserHistory)({
    basename: AppConstants.baseUrl
});

history.locationQueue = [];

export default history;
