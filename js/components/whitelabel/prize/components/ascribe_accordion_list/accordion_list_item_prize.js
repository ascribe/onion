'use strict';

import React from 'react';

import AccordionListItemPiece from '../../../../ascribe_accordion_list/accordion_list_item_piece';

import PieceListActions from '../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../stores/piece_list_store';

import WhitelabelStore from '../../../../../stores/whitelabel_store';

import GlobalNotificationModel from '../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../actions/global_notification_actions';

import AclProxy from '../../../../acl_proxy';
import SubmitToPrizeButton from './../ascribe_buttons/submit_to_prize_button';

import { getLangText } from '../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../utils/general_utils';


let AccordionListItemWallet = React.createClass({
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
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
        WhitelabelStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSubmitPrizeSuccess(response) {
        PieceListActions.fetchPieceList(this.state.page, this.state.pageSize, this.state.search,
                                        this.state.orderBy, this.state.orderAsc, this.state.filterBy);

        let notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {

        return (
            <AccordionListItemPiece
                className={this.props.className}
                piece={this.props.content}
                subsubheading={
                    <div className="pull-left">
                        <span>{this.props.content.date_created.split('-')[0]}</span>
                    </div>}
                buttons={
                    <div>
                        <AclProxy
                            aclObject={this.props.content.acl}
                            aclName="acl_submit_to_prize">
                            <SubmitToPrizeButton
                                className="pull-right"
                                piece={this.props.content}
                                handleSuccess={this.handleSubmitPrizeSuccess}/>
                        </AclProxy>
                    </div>}
                >
                {this.props.children}
            </AccordionListItemPiece>
        );
    }
});

export default AccordionListItemWallet;
