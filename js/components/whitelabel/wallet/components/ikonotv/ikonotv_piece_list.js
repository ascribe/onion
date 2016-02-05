'use strict';

import React from 'react';

import PieceList from '../../../../piece_list';

import NotificationStore from '../../../../../stores/notification_store';

import IkonotvAccordionListItem from './ikonotv_accordion_list/ikonotv_accordion_list_item';

import { setDocumentTitle } from '../../../../../utils/dom_utils';
import { getLangText } from '../../../../../utils/lang_utils';


let IkonotvPieceList = React.createClass({
    propTypes: {
        // Provided from PrizeApp
        currentUser: React.PropTypes.object,
        whitelabel: React.PropTypes.object,

        // Provided from router
        location: React.PropTypes.object
    },

    getInitialState() {
        return NotificationStore.getState();
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    shouldRedirect(pieceCount) {
        const { currentUser: { email: userEmail },
                whitelabel: {
                    user: whitelabelAdminEmail
                } } = this.props;
        const { contractAgreementListNotifications } = this.state;

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
                    {...this.props}
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
                    redirectTo={{
                        pathname: '/register_piece',
                        query: {
                            'slide_num': 0
                        }
                    }}
                    shouldRedirect={this.shouldRedirect} />
            </div>
        );
    }
});

export default IkonotvPieceList;
