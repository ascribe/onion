import useRouterHistory from 'react-router/es6/useRouterHistory';
// History should be included by react-router
// eslint-disable-next-line import/no-extraneous-dependencies
import createBrowserHistory from 'history/lib/createBrowserHistory';

import AppConstants from './constants/application_constants';


const history = useRouterHistory(createBrowserHistory)({
    basename: AppConstants.appBasePath
});

history.locationQueue = [];

export default history;
