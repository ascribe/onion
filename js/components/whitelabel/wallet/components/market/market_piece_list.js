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
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    componentWillMount() {
        setDocumentTitle(getLangText('Collection'));
    },

    render() {
        const {
            currentUser: { email: userEmail },
            customThumbnailPlaceholder,
            whitelabel: {
                name: whitelabelName = 'Market',
                user: whitelabelAdminEmail
            } } = this.props;

        let filterParams = null;
        let canLoadPieceList = false;

        if (userEmail && whitelabelAdminEmail) {
            canLoadPieceList = true;
            const isUserAdmin = userEmail === whitelabelAdminEmail;

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
                redirectTo="/register_piece?slide_num=0"
                bulkModalButtonListType={MarketAclButtonList}
                customThumbnailPlaceholder={customThumbnailPlaceholder}
                filterParams={filterParams} />
        );
    }
});

export default MarketPieceList;
