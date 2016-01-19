'use strict';

import React from 'react';

import PieceList from '../../../../piece_list';

import UserActions from '../../../../../actions/user_actions';
import UserStore from '../../../../../stores/user_store';
import NotificationStore from '../../../../../stores/notification_store';

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
            UserStore.getState()
        );
    },

    componentDidMount() {
        NotificationStore.listen(this.onChange);
        UserStore.listen(this.onChange);

        UserActions.fetchCurrentUser();
    },

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);

    },

    redirectIfNoContractNotifications() {
        const { contractAgreementListNotifications } = this.state;

        return contractAgreementListNotifications && !contractAgreementListNotifications.length;
    },

    render() {
        setDocumentTitle(getLangText('Register a new piece'));

        return (
            <div>
                <PieceList
                    redirectTo="/register_piece?slide_num=0"
                    shouldRedirect={this.redirectIfNoContractNotifications}
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
