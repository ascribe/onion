'use strict';

import React from 'react';

import MarketAdditionalDataForm from '../market_forms/market_additional_data_form'

let MarketFurtherDetails = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        handleSuccess: React.PropTypes.func,
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
