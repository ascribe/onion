'use strict';

import React from 'react';

/**
 * This component can easily be used to present another component conditionally
 * - dependent on their acl.
 *
 * In order to do that, just wrap AclProxy around the component, add aclObject and
 * the acl name you're looking for.
 */
let AclProxy = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]).isRequired,
        aclObject: React.PropTypes.object,
        aclName: React.PropTypes.string,
        show: React.PropTypes.bool
    },

    getChildren() {
        if (React.Children.count(this.props.children) > 1){
            /*
            This might ruin styles for header items in the navbar etc
             */
            return (
                <span>
                    {this.props.children}
                </span>
            );
        }
        /* can only do this when there is only 1 child, but will preserve styles */
        return this.props.children;
    },

    render() {
        if(this.props.show) {
            return this.getChildren();
        } else {
            if(this.props.aclObject) {
                if(this.props.aclObject[this.props.aclName]) {
                    return this.getChildren();
                } else {
                    /* if(typeof this.props.aclObject[this.props.aclName] === 'undefined') {
                        console.warn('The aclName you\'re filtering for was not present (or undefined) in the aclObject.');
                    } */
                    return null;
                }
            }
        }
        return null;
    }
});

export default AclProxy;
