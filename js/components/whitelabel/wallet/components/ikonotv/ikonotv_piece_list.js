'use strict';

import React from 'react';

import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';

import NotificationStore from '../../../../../stores/notification_store';

import WhitelabelActions from '../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../stores/whitelabel_store';

import IkonotvAccordionListItem from './ikonotv_accordion_list/ikonotv_accordion_list_item';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { mergeOptions } from '../../../../../utils/general_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let IkonotvPieceList = React.createClass({
    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return mergeOptions(
            NotificationStore.getState(),
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
        UserStore.listen(this.onChange);

        WhitelabelActions.fetchWhitelabel();
        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    shouldRedirect(pieceCount) {
        const { contractAgreementListNotifications,
                currentUser: { email: userEmail },
                whitelabel: {
                    user: whitelabelAdminEmail
                } } = this.state;

        return contractAgreementListNotifications &&
               !contractAgreementListNotifications.length &&
               userEmail !== whitelabelAdminEmail &&
               !pieceCount;
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

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
                    accordionListItemType={IkonotvAccordionListItem}
                    filterParams={[{
                        label: getLangText('Show works I have'),
                        items: [
                            {
                                key: 'submitted',
                                label: getLangText('submitted')
                            },
                            {
                                key: 'accepted',
                                label: getLangText('loaned')
                            }
                        ]
                    }]}
                    location={this.props.location}/>
            </div>
        );
    }
});

export default IkonotvPieceList;
