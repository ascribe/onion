'use strict';

import React from 'react';

const AppRouteWrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired
    },

    render() {
        let { children, ...propsToPropagate } = this.props;

        // If there are more props given, propagate them into the child routes by cloning the routes
        if (Object.keys(propsToPropagate).length) {
            children = React.Children.map(children, (child) => {
                return React.cloneElement(child, propsToPropagate);
            });
        }

        return (
            <div className="container ascribe-body">
                {children}
            </div>
        );
    }
});

export default AppRouteWrapper;
