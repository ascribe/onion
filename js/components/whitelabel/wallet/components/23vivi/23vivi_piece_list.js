'use strict';

import React from 'react';

import Vivi23AccordionListItemThumbnailPlaceholder from './23vivi_accordion_list/23vivi_accordion_list_item_thumbnail_placeholder';

import MarketPieceList from '../market/market_piece_list';

let Vivi23PieceList = React.createClass({
    propTypes: {
        // Provided from WalletApp
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        return (
            <MarketPieceList
                {...this.props}
                customThumbnailPlaceholder={Vivi23AccordionListItemThumbnailPlaceholder} />
        );
    }
});

export default Vivi23PieceList;
