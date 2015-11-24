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

    render() {
        const { currentUser, whitelabel } = this.state;
        let filterParams = undefined;
        let canLoadPieceList = false;

        if (currentUser.email && whitelabel.user) {
            canLoadPieceList = true;
            const isUserAdmin = currentUser.email === whitelabel.user;

            filterParams = [{
                label: getLangText('Show works I can'),
                items: [{
                    key: isUserAdmin ? 'acl_transfer' : 'acl_consign',
                    label: getLangText(isUserAdmin ? 'transfer' : 'consign to %s', whitelabel.name),
                    defaultValue: true
                }]
            }];
        }

        return (
            <PieceList
                canLoadPieceList={canLoadPieceList}
                redirectTo="/register_piece?slide_num=0"
                bulkModalButtonListType={MarketAclButtonList}
                filterParams={filterParams}
                location={this.props.location} />
        );
    }
});

export default MarketPieceList;
