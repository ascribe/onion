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
          'Some error message'
        );
    }
});

export default ProxyRoute;