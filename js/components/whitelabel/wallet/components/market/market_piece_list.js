'use strict';

import React from 'react';

import MarketAclButtonList from './market_buttons/market_acl_button_list';

import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';
import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';

let MarketPieceList = React.createClass({
    propTypes: {
        customThumbnailPlaceholder: React.PropTypes.func,
        location: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentWillMount() {
        setDocumentTitle(getLangText('Collection'));
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    shouldRedirect(isUserAdmin) {
        return (pieceCount) => !isUserAdmin && !pieceCount;
    },

    render() {
        const { customThumbnailPlaceholder, location } = this.props;
        const {
            currentUser: { email: userEmail },
            whitelabel: {
                name: whitelabelName = 'Market',
                user: whitelabelAdminEmail
            } } = this.state;

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
                canLoadPieceList={canLoadPieceList}
                redirectTo={{
                    pathname: '/register_piece',
                    query: {
                        'slide_num': 0
                    }
                }}
                shouldRedirect={this.shouldRedirect(isUserAdmin)}
                bulkModalButtonListType={MarketAclButtonList}
                customThumbnailPlaceholder={customThumbnailPlaceholder}
                filterParams={filterParams}
                location={location} />
        );
    }
});

export default MarketPieceList;
