'use strict';

import React from 'react';

import SluiceSelectedPrizeActionButton from '../sluice_buttons/sluice_selected_prize_action_button';

import PrizePieceContainer from '../../../simple_prize/components/ascribe_detail/prize_piece_container';

const SluicePieceContainer = React.createClass({
    propTypes: {
        params: React.PropTypes.object
    },

    render() {
        return (
            <PrizePieceContainer
                {...this.props}
                selectedPrizeActionButton={SluiceSelectedPrizeActionButton} />
        );
    }
});

export default SluicePieceContainer;
