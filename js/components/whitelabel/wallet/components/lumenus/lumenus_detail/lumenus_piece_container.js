'use strict';

import React from 'react';

import LumenusFurtherDetails from './lumenus_further_details';

import PieceContainer from '../../../../../ascribe_detail/piece_container';

let LumenusPieceContainer = React.createClass({
    propTypes: PieceContainer.propTypes,

    render() {
        return (
            <PieceContainer
                {...this.props}
                furtherDetailsType={LumenusFurtherDetails} />
        );
    }
});

export default LumenusPieceContainer;
