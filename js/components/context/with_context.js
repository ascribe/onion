import React from 'react';
import { currentUserShape, locationShape, routerShape, whitelabelShape } from '../prop_types';

import { selectFromObject } from '../../utils/general';
import { getDisplayName } from '../../utils/react';

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
    location: locationShape.isRequired,
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
        console.logGlobal(
            new Error('Used `withContext` without supplying any items to inject from the ' +
                      "component's context"),
            { wrappedComponentName }
        );

        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`Either add context types to ${wrappedComponentName} or remove ` +
                         '`withContext` from it');
        }

        return WrappedComponent;
    }

    const contextTypes = contextProps.reduce((types, contextProp) => {
        const contextDef = ContextPropDefinitions[contextProp];

        if (contextDef) {
            Object.assign(types, contextDef.contextTypes);
        } else {
            console.logGlobal(
                new Error('No context type was matched when adding context through `withContext`'),
                { contextProp, wrappedComponentName }
            );

            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn(`Make sure to add the context type information for ${contextProp} ` +
                             "to 'with_context.js.");
            }
        }

        return types;
    }, {});

    const WithContext = (props, context) => {
        if (process.env.NODE_ENV !== 'production') {
            // Check if the expected context was available
            Object.keys(contextTypes).forEach((contextType) => {
                if (!context[contextType]) {
                    console.logGlobal(
                        new Error('Expected context type did not exist in context when mounting ' +
                                  'component through `withContext`'),
                        { contextType, wrappedComponentName }
                    );

                    if (process.env.NODE_ENV !== 'production') {
                        // eslint-disable-next-line no-console
                        console.warn(`Missing ${contextType} from context in ${wrappedComponentName}`);
                    }
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

    WithContext.displayName = `WithContext(${wrappedComponentName}): [${contextProps.join(', ')}]`;
    WithContext.contextTypes = contextTypes;

    return WithContext;
}
