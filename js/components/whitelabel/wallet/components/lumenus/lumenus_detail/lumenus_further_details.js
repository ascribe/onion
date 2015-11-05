'use strict';

import React from 'react';

import LumenusAdditionalDataForm from '../lumenus_forms/lumenus_additional_data_form'

let LumenusFurtherDetails = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        handleSuccess: React.PropTypes.func,
    },

    render() {
        return (
            <LumenusAdditionalDataForm
                {...this.props}
                isInline
                showNotification />
        );
    }
});

export default LumenusFurtherDetails;
