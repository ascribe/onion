'use strict';

import React from 'react';

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
                <div>
                    {this.props.children}
                </div>
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