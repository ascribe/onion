'use strict';

import React from 'react';

import DetailProperty from './detail_property';

/**
 * This is the component that implements display-specific functionality
 */
let LicenseDetail = React.createClass({
    propTypes: {
        license: React.PropTypes.object
    },
    render () {
        if (this.props.license.code === 'default') {
            return null;
        }
        return (
            <DetailProperty
                label="LICENSE"
                value={
                    <a href={this.props.license.url} target="_blank">
                        { this.props.license.code.toUpperCase() + ': ' + this.props.license.name}
                    </a>
                }
                />
        );
    }
});

export default LicenseDetail;
