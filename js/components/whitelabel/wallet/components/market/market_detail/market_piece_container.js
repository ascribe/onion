'use strict';

import React from 'react';

import MarketFurtherDetails from './market_further_details';

import PieceContainer from '../../../../../ascribe_detail/piece_container';

let MarketPieceContainer = React.createClass({
    propTypes: PieceContainer.propTypes,

    render() {
        return (
            <PieceContainer
                {...this.props}
                furtherDetailsType={MarketFurtherDetails} />
        );
    }
});

export default MarketPieceContainer;
