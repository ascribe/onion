'use strict'

import React from 'react';

import Vivi23AccordionListItemThumbnailPlaceholder from './23vivi_accordion_list/23vivi_accordion_list_item_thumbnail_placeholder';

import MarketPieceList from '../market/market_piece_list';

let Vivi23PieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    render() {
        return (
            <MarketPieceList
                customThumbnailPlaceholder={Vivi23AccordionListItemThumbnailPlaceholder}
                location={this.props.location} />
        );
    }

});

export default Vivi23PieceList;
