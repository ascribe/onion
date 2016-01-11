'use strict';

import React from 'react';

import { omitFromObject } from '../utils/general_utils';

const AppRouteWrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired
    },

    render() {
        const propsToPropagate = omitFromObject(this.props, ['children']);

        let childrenWithProps = this.props.children;
        // If there are more props given, propagate them into the child routes by cloning the routes
        if (Object.keys(propsToPropagate).length) {
            childrenWithProps = React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, propsToPropagate);
            });
        }

        return (
            <div className="ascribe-body">
                {childrenWithProps}
            </div>
        );
    }
});

export default AppRouteWrapper;
