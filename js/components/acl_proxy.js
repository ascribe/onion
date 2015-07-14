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
        aclObject: React.PropTypes.object.isRequired,
        aclName: React.PropTypes.string.isRequired
    },

    render() {
        if(this.props.aclObject[this.props.aclName]) {
            return (
                <span>
                    {this.props.children}
                </span>
            );
        } else {
            if(typeof this.props.aclObject[this.props.aclName] === 'undefined') {
                console.warn('The aclName you\'re filtering for was not present (undefined) in the aclObject.');
            }
            return null;
        }
    }
});

export default AclProxy;