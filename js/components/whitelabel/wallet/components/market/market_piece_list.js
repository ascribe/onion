'use strict';

import React from 'react';

import MarketAclButtonList from './market_buttons/market_acl_button_list';

import PieceList from '../../../../piece_list';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';

let MarketPieceList = React.createClass({
    propTypes: {
        customThumbnailPlaceholder: React.PropTypes.func,

        // Provided from PrizeApp
        currentUser: React.PropTypes.object.isRequired,
        whitelabel: React.PropTypes.object.isRequired,

        // Provided from router
        location: React.PropTypes.object
    },

    componentWillMount() {
        setDocumentTitle(getLangText('Collection'));
    },

    render() {
        const { currentUser: { email: userEmail },
                whitelabel: {
                    name: whitelabelName = 'Market',
                    user: whitelabelAdminEmail
                } } = this.props;

        let filterParams = null;
        let isUserAdmin = null;
        let canLoadPieceList = false;

        if (userEmail && whitelabelAdminEmail) {
            canLoadPieceList = true;
            isUserAdmin = userEmail === whitelabelAdminEmail;

            filterParams = [{
                label: getLangText('Show works I can'),
                items: [{
                    key: isUserAdmin ? 'acl_transfer' : 'acl_consign',
                    label: getLangText(isUserAdmin ? 'transfer' : 'consign to %s', whitelabelName),
                    defaultValue: true
                }]
            }];
        }

        return (
            <PieceList
                {...this.props}
                canLoadPieceList={canLoadPieceList}
                redirectTo={{
                    pathname: '/register_piece',
                    query: {
                        'slide_num': 0
                    }
                }}
                shouldRedirect={(pieceCount) => !isUserAdmin && !pieceCount}
                bulkModalButtonListType={MarketAclButtonList}
                filterParams={filterParams} />
        );
    }
});

export default MarketPieceList;
