import React from 'react';

import UserStore from '../../stores/user_store';

import withContext from '../context/with_context';
import { currentUserShape, locationShape, routerShape, whitelabelShape } from '../prop_types';

import AppConstants from '../../constants/application_constants';


const { bool } = React.PropTypes;
const WHEN_ENUM = ['loggedIn', 'loggedOut'];

/**
 * Redirects the user conditionally according to his authentication
 *
 * @param {enum/string} options.when ('loggedIn' || 'loggedOut')
 */
export function AuthRedirect({ to, when }) {
    // validate `when`, must be contained in `WHEN_ENUM`.
    // Throw an error otherwise.
    if (WHEN_ENUM.indexOf(when) === -1) {
        const whenValues = WHEN_ENUM.join(', ');
        throw new Error(`"when" must be one of: [${whenValues}] got "${when}" instead`);
    }

    return function redirectRoute(router, { query }, { isLoggedIn }) {
        const { redirectAuthenticated, redirect } = query;

        // The user of this handler specifies with `when`, what kind of status
        // needs to be checked to conditionally do - if that state is `true` -
        // a redirect.
        //
        // So if when === 'loggedIn', we're checking if the user is logged in (and
        // vice versa)
        const exprToValidate = when === 'loggedIn' ? isLoggedIn : !isLoggedIn;

        // and redirect if `true`.
        if (exprToValidate) {
            window.setTimeout(() => router.replace({ query, pathname: to }));
            return true;

            // Otherwise there can also be the case that the backend
            // wants to redirect the user to a specific route when the user is logged out already
        } else if (!exprToValidate && when === 'loggedIn' && redirect) {
            delete query.redirect;
            window.setTimeout(() => router.replace({ query, pathname: `/${redirect}` }));
            return true;

        } else if (!exprToValidate && when === 'loggedOut' && redirectAuthenticated) {
            /**
             * redirectAuthenticated contains an arbitrary path
             * eg pieces/<id>, editions/<bitcoin_id>, collection, settings, ...
             * hence transitionTo cannot be used directly.
             *
             * While we're getting rid of `query.redirect` explicitly in the
             * above `else if` statement, here it's sufficient to just set the
             * location to `${appBasePath}/${redirectAuthenticated}`, as this will
             * get rid of queries as well.
             */
            window.location = `${AppConstants.appBasePath}/${redirectAuthenticated}`;
            return true;
        }

        return false;
    };
}

/**
 * Can be used in combination with `Route` as an intermediate Handler
 * between the actual component we want to display dependent on a certain state
 * that is required to display that component.
 *
 * @param {[function]} redirectFn A function that conditionally redirects
 */
export function ProxyHandler(...redirectFunctions) {
    return (Component) => {
        // Don't worry about shadowing the HOC here; using a declaration like this allows
        // babel-plugin-react-display-name to automatically generate the displayName.
        // eslint-disable-next-line no-shadow
        const ProxyHandler = React.createClass({
            propTypes: {
                // Injected through HOCs
                currentUser: currentUserShape.isRequired,
                isLoggedIn: bool.isRequired,
                location: locationShape.isRequired,
                router: routerShape.isRequired,
                whitelabel: whitelabelShape.isRequired
            },

            componentDidMount() {
                this.evaluateRedirectFunctions();
            },

            componentWillReceiveProps(nextProps) {
                this.evaluateRedirectFunctions(nextProps);
            },

            evaluateRedirectFunctions(props = this.props) {
                const { currentUser, isLoggedIn, location, router, whitelabel } = props;

                if (UserStore.hasLoaded() && !UserStore.isLoading()) {
                    const context = { currentUser, isLoggedIn, whitelabel };

                    for (let i = 0; i < redirectFunctions.length; i++) {
                        // if a redirectFunction redirects the user, it should return `true` and
                        // therefore stop/avoid the execution of all functions that follow
                        if (redirectFunctions[i](router, location, context)) {
                            break;
                        }
                    }
                }
            },

            render() {
                return (
                    <Component {...this.props} />
                );
            }
        });

        return withContext(ProxyHandler,
                           'currentUser',
                           'isLoggedIn',
                           'location',
                           'router',
                           'whitelabel');
    };
}
