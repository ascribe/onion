'use strict';

import React from 'react';
import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import CylandAccordionListItem from './cyland_accordion_list/cyland_accordion_list_item';

import { getLangText } from '../../../../../utils/lang_utils';
import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';

let CylandPieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        WhitelabelStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    shouldRedirect(pieceCount) {
        const {
            currentUser: { email: userEmail },
                whitelabel: {
                    user: whitelabelAdminEmail
            }
         } = this.state;

         return userEmail !== whitelabelAdminEmail && !pieceCount;
    },

    render() {
        setDocumentTitle(getLangText('Collection'));

        return (
            <div>
                <PieceList
                    redirectTo={{
                        pathname: '/register_piece',
                        query: {
                            'slide_num': 0
                        }
                    }}
                    shouldRedirect={this.shouldRedirect}
                    accordionListItemType={CylandAccordionListItem}
                    filterParams={[{
                        label: getLangText('Show works I have'),
                        items: [{
                            key: 'acl_loaned',
                            label: getLangText('loaned to Cyland')
                        }]
                    }]}
                    location={this.props.location}/>
            </div>
        );
    }
});

export default CylandPieceList;
