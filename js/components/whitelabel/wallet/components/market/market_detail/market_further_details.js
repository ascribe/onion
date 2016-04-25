'use strict';

import React from 'react';

import MarketAdditionalDataForm from '../market_forms/market_additional_data_form';

let MarketFurtherDetails = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number.isRequired,

        editable: React.PropTypes.bool,
        extraData: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    getDefaultProps() {
        // Override MarketAdditionalDataForm's default `editable` setting of true
        return {
            editable: false
        };
    },

    render() {
        return (
            <MarketAdditionalDataForm
                {...this.props}
                isInline
                showNotification />
        );
    }
});

export default MarketFurtherDetails;
