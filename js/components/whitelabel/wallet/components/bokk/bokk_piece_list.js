'use strict';

import React from 'react';

import PieceList from '../../../../piece_list';
import BokkAclButtonList from './bokk_acl_button_list.js';


let BokkPieceList = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    render() {
        return (
            <PieceList
                {...this.props}
                redirectTo={{
                    pathname: '/register_piece',
                    query: {
                        'slide_num': 0
                    }
                }}
                bulkModalButtonListType={BokkAclButtonList} />
        );
    }
});

export default BokkPieceList;
