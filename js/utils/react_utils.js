import React from 'react';
import { currentUserShape, whitelabelShape } from '../components/prop_types';


/**
 * Taken from react-router (https://github.com/reactjs/react-router/blob/master/modules/withRouter.js)
 * FIXME: should be put into react-component's utils
 */
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * Similar to react-router's `withRouter`, this injects the `currentUser` from the Component's
 * context into the Component as a prop. It also injects whether the user's logged in or not as
 * `isLoggedIn`.
 *
 * @param  {Component} Component Component to inject `context.currentUser` and `isLoggedIn` into
 * @return {Component}           Wrapped component
 */
export function withCurrentUser(Component) {
    const contextTypes = {
        currentUser: currentUserShape.isRequired
    };

    const WithCurrentUser = (props, { currentUser }) => (
        <Component {...props} currentUser={currentUser} isLoggedIn={!!currentUser.email} />
    );

    WithCurrentUser.displayName = `WithCurrentUser(${getDisplayName(Component)})`;
    WithCurrentUser.contextTypes = contextTypes;

    return WithCurrentUser;
}

/**
 * Similar to react-router's `withRouter`, this injects the `whitelabel` from the Component's
 * context into the Component as a prop.
 *
 * @param  {Component} Component Component to inject `context.whitelabel` into
 * @return {Component}           Wrapped component
 */
export function withWhitelabel(Component) {
    const contextTypes = {
        whitelabel: whitelabelShape.isRequired
    };

    const WithWhitelabel = (props, { whitelabel }) => (
        <Component {...props} whitelabel={whitelabel} />
    );

    WithWhitelabel.displayName = `WithWhitelabel(${getDisplayName(Component)})`;
    WithWhitelabel.contextTypes = contextTypes;

    return WithWhitelabel;
}