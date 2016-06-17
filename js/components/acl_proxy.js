import React from 'react';

import { omitFromObject } from '../utils/general';


/**
 * This component can easily be used to present another component conditionally
 * - dependent on their acl.
 *
 * In order to do that, just wrap AclProxy around the component, add aclObject and
 * the acl name you're looking for.
 */
const AclProxy = React.createClass({
    propTypes: {
        children: React.PropTypes.node.isRequired,

        aclName: React.PropTypes.string,
        aclObject: React.PropTypes.object,
        show: React.PropTypes.bool
    },

    getChildren() {
        const childProps = omitFromObject(this.props, ['aclName', 'aclObject', 'children', 'show']);
        const children = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, childProps)
        );

        if (children.length > 1) {
            // This has the potential to ruin some styling, but React doesn't let us just return an
            // array of components.
            return (<span>{children}</span>);
        } else {
            return children[0];
        }
    },

    render() {
        const { aclName, aclObject, show } = this.props;

        if (show) {
            return this.getChildren();
        } else if (aclObject) {
            if (aclObject[aclName]) {
                return this.getChildren();
            } else if (false && process.env.NODE_ENV !== 'production') {
                // Warning currently disabled because the main app's acls don't include whitelabel
                // specific acls, causing a lot of warnings
                // eslint-disable-next-line no-console
                console.warn(`The aclName (${aclName}) you're filtering for was not present (or  ` +
                             'undefined) in the aclObject.');
            }
        }

        return null;
    }
});

export default AclProxy;
