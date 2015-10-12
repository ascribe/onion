'use strict';

import React from 'react';
import invariant from 'invariant';
import { createRoutes } from 'react-router';

const { string, bool, func, object, oneOfType } = React.PropTypes;

const ProxyRoute = React.createClass({
    propTypes: {
        path: string,
        ignoreScrollBehavior: bool,
        handler: oneOfType([ func, string ]),
        component: oneOfType([ func, string ]),
        components: oneOfType([ oneOfType([ func, string ]), object ]),
        getComponents: func,
        proxyHandler: func
    },

    statics: {
        createRouteFromReactElement(element) {
            /**
             * Generally creating custom `Route`s is not supported by react-router.
             *
             * However, if we take a look at how `Route`s are declared/generated in their github repo,
             * we see that it's fairly straight forward:
             * - https://github.com/rackt/react-router/blob/master/modules/Route.js#L21
             *
             * ```
             * const route = createRouteFromReactElement(element)
             *
             * [...]
             *
             * return route;
             * ```
             *
             * Unfortunately, though `createRouteFromReactElement` is not exported by
             * react-router, as can be seen here:
             * - https://github.com/rackt/react-router/blob/master/modules/index.js#L19
             *
             * Still there is a trick we can use to call this method manually.
             * We call the public method `createRoutes`:
             * - (https://github.com/rackt/react-router/blob/master/modules/RouteUtils.js#L91)
             * which then calls `createRoutesFromReactChildren`
             *
             * For each route element submitted as an array, this method checks if
             * `element.type.createRouteFromReactElement` is `true` or `false`.
             *
             * So what we can do is just simply set our element's `type.createRouteFromReactElement`
             * property to `false`, so that the if statement falls into the methods `else` case
             * and calls `createRouteFromReactElement`:
             * - https://github.com/rackt/react-router/blob/master/modules/RouteUtils.js#L77
             *
             * After returning from `createRoutes`, we set `element.type.createRouteFromReactElement`
             * to its original value and replace route's `component`, with our manually inserted
             * component.
             */

            const createRouteFromReactElementCopy = element.type.createRouteFromReactElement;
            element.type.createRouteFromReactElement = false;
            const [ route ] = createRoutes(element);
            element.type.createRouteFromReactElement = createRouteFromReactElementCopy;

            const Component = route.component;
            const ProxyHandler = element.props.proxyHandler;
            route.component = ProxyHandler(Component);

            return route;
        }
    },

    render() {
        invariant(
          false,
          '<ProxyRoute> elements are for router configuration only and should not be rendered'
        );
    }
});

export default ProxyRoute;