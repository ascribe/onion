'use strict';

import React from 'react';

import LumenusFurtherDetails from './lumenus_further_details';

import PieceContainer from '../../../../../ascribe_detail/piece_container';

let LumenusPieceContainer = React.createClass({
    propTypes: {
        params: React.PropTypes.object,
        location: React.PropTypes.object
    },

    render() {
        return (
            <PieceContainer
                params={this.props.params}
                furtherDetailsType={LumenusFurtherDetails}
                location={this.props.location} />
        );
    }
});

export default LumenusPieceContainer;
