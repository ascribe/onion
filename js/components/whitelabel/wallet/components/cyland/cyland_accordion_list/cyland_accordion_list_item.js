'use strict';

import React from 'react';
import Moment from 'moment';

import AccordionListItemPiece from '../../../../../ascribe_accordion_list/accordion_list_item_piece';

import PieceListActions from '../../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../../stores/piece_list_store';

import UserStore from '../../../../../../stores/user_store';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import CylandSubmitButton from '../cyland_buttons/cyland_submit_button';
import AclProxy from '../../../../../acl_proxy';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let CylandAccordionListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    },

    getInitialState() {
        return mergeOptions(
            PieceListStore.getState(),
            UserStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        UserStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        UserStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSubmitSuccess(response) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({page, pageSize, search, orderBy, orderAsc, filterBy});

        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getSubmitButtons() {
        return (
            <div>
                <AclProxy
                    aclObject={this.props.content.acl}
                    aclName="acl_wallet_submit">
                    <CylandSubmitButton
                        className="pull-right"
                        piece={this.props.content}
                        handleSuccess={this.handleSubmitSuccess}/>
                </AclProxy>
                <AclProxy
                    aclObject={this.props.content.acl}
                    aclName="acl_wallet_submitted">
                    <button
                    disabled
                    className="btn btn-default btn-xs pull-right">
                        {getLangText('Submitted to Cyland') + ' '}
                        <span className='ascribe-icon icon-ascribe-ok'/>
                    </button>
                </AclProxy>
                <AclProxy
                    aclObject={this.props.content.acl}
                    aclName="acl_wallet_accepted">
                    <button
                    disabled
                    className="btn btn-default btn-xs pull-right">
                        {getLangText('Loaned to Cyland') + ' '}
                        <span className='ascribe-icon icon-ascribe-ok'/>
                    </button>
                </AclProxy>
            </div>
        );
    },

    render() {
        return (
            <AccordionListItemPiece
                className={this.props.className}
                piece={this.props.content}
                subsubheading={
                    <div className="pull-left">
                        <span>{Moment(this.props.content.date_created, 'YYYY-MM-DD').year()}</span>
                    </div>}
                buttons={this.getSubmitButtons()}>
                {this.props.children}
            </AccordionListItemPiece>
        );
    }
});

export default CylandAccordionListItem;
