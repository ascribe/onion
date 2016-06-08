import React from 'react';
import { currentUserShape, routerShape, whitelabelShape } from '../prop_types';

import { selectFromObject } from '../../utils/general_utils';
import { getDisplayName } from '../../utils/react_utils';

/**
 * ContextPropDefinitions
 * ======================
 * contextType definitions for `contextProp`s.
 *
 * Each definition is of the form:
 *
 * contextProp = {
 *     'contextTypes': {
 *         'contextType': contextType used by the contextProp,
 *         ...
 *     },
 *     transformToProps: (optional) function that will receive the contextTypes from the component's
 *                       context and should return an object containing the props to inject.
 * }
 *
 * In the common case where your `contextProp` maps directly to the `contextType` used
 * (eg. using `currentUser` as a `contextProp` to get the `currentUser` from context), you can omit
 * the object definition and simply assign the `contextType` to the `contextProp`:
 *
 * contextProp = contextType
 *
 * as opposed to:
 *
 * contextProp = {
 *     'contextTypes': {
 *         contextProp: contextType
 *     }
 * }
 */
const ContextPropDefinitions = {
    currentUser: currentUserShape.isRequired,
    isLoggedIn: {
        contextTypes: {
            currentUser: currentUserShape.isRequired
        },
        transformToProps: ({ currentUser }) => ({ isLoggedIn: !!currentUser.email })
    },
    router: routerShape.isRequired,
    whitelabel: whitelabelShape.isRequired
};

// Expand any shortform definitions in ContextPropDefinitions into a normalized form that's
// easier for withContext to work with
Object.entries(ContextPropDefinitions).forEach(([prop, def]) => {
    if (!def.hasOwnProperty('contextTypes')) {
        ContextPropDefinitions[prop] = {
            contextTypes: {
                [prop]: def
            }
        };
    }
});

/**
 * Generalized version of react-router's `withRouter`.
 * This injects the given `contextProp`s from the WrappedComponent's context into the component as
 * a prop.
 *
 * Given `contextProp`s must have a matching definition in `ContextPropDefinitions`.
 *
 * @param  {Component} WrappedComponent Component to inject context into
 * @param  {...string} contextProps     Argument list of `contextProp`s (that must be registered in
 *                                      `ContextPropDefinitions`) to be injected into component as
 *                                      props
 * @return {Component}                  Wrapped component
 */
export default function withContext(WrappedComponent, ...contextProps) {
    const wrappedComponentName = getDisplayName(WrappedComponent);

    if (!contextProps.length) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`Used withContext on ${wrappedComponentName} without supplying any ` +
                         "items to inject from the component's context. Ignoring...");
        }

        return WrappedComponent;
    }

    const contextTypes = contextProps.reduce((types, contextProp) => {
        const contextDef = ContextPropDefinitions[contextProp];

        if (contextDef) {
            Object.assign(types, contextDef.contextTypes);
        } else if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`No context types were found for '${contextProp}' when adding context ` +
                         `to ${wrappedComponentName}. Make sure to add the context information ` +
                         'with_context.js.');
        }

        return types;
    }, {});

    const WithContext = (props, context) => {
        if (process.env.NODE_ENV !== 'production') {
            // Check if the expected context was available
            Object.keys(contextTypes).forEach((contextType) => {
                if (!context[contextType]) {
                    // eslint-disable-next-line no-console
                    console.warn(`Expected '${contextType}' did not exist in ` +
                                 `${wrappedComponentName}'s context during mounting`);
                }
            });
        }

        const injectedProps = Object.assign({}, ...contextProps.map((contextProp) => {
            const contextDef = ContextPropDefinitions[contextProp];

            if (contextDef) {
                const contextForProp = selectFromObject(context, Object.keys(contextDef.contextTypes));
                return typeof contextDef.transformToProps === 'function'
                    ? contextDef.transformToProps(contextForProp)
                    : contextForProp;
            } else {
                // Will be ignored by Object.assign()
                return undefined;
            }
        }));

        return (
            <WrappedComponent {...props} {...injectedProps} />
        );
    };

    WithContext.displayName = `WithContext(${wrappedComponentName}): ${contextProps.join(', ')}`;
    WithContext.contextTypes = contextTypes;

    return WithContext;
}
