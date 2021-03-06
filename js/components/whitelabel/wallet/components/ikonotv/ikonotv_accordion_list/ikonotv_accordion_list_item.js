'use strict';

import React from 'react';
import Moment from 'moment';

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

import PieceListActions from '../../../../../../actions/piece_list_actions';
import PieceListStore from '../../../../../../stores/piece_list_store';

import IkonotvSubmitButton from '../ikonotv_buttons/ikonotv_submit_button';

import AccordionListItemPiece from '../../../../../ascribe_accordion_list/accordion_list_item_piece';

import AclProxy from '../../../../../acl_proxy';

import { getLangText } from '../../../../../../utils/lang_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';


let IkonotvAccordionListItem = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ]),
        className: React.PropTypes.string
    },

    getInitialState() {
        return PieceListStore.getState();
    },

    componentDidMount() {
        PieceListStore.listen(this.onChange);
    },

    componentWillUnmount() {
        PieceListStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    handleSubmitSuccess(response) {
        const { filterBy, orderAsc, orderBy, page, pageSize, search } = this.state;

        PieceListActions.fetchPieceList({ page, pageSize, search, orderBy, orderAsc, filterBy });

        const notification = new GlobalNotificationModel(response.notification, 'success', 10000);
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    getSubmitButtons() {
        const { content, currentUser } = this.props;

        return (
            <div>
                <AclProxy
                    aclObject={currentUser.acl}
                    aclName="acl_wallet_submit">
                    <AclProxy
                        aclObject={content.acl}
                        aclName="acl_wallet_submit">
                        <IkonotvSubmitButton
                            className="btn-xs pull-right"
                            handleSuccess={this.handleSubmitSuccess}
                            piece={content}/>
                    </AclProxy>
                </AclProxy>
                <AclProxy
                    aclObject={content.acl}
                    aclName="acl_wallet_submitted">
                    <button
                        disabled
                        className="btn btn-default btn-xs pull-right">
                        {getLangText('Submitted to IkonoTV') + ' '}
                        <span className='ascribe-icon icon-ascribe-ok'/>
                    </button>
                </AclProxy>
                <AclProxy
                    aclObject={content.acl}
                    aclName="acl_wallet_accepted">
                    <button
                        disabled
                        className="btn btn-default btn-xs pull-right">
                        {getLangText('Loaned to IkonoTV') + ' '}
                        <span className='ascribe-icon icon-ascribe-ok'/>
                    </button>
                </AclProxy>
            </div>
        );
    },

    render() {
        const { children, className, content } = this.props;

        return (
            <AccordionListItemPiece
                className={className}
                piece={content}
                subsubheading={
                    <div className="pull-left">
                        <span>{Moment(content.date_created, 'YYYY-MM-DD').year()}</span>
                    </div>
                }
                buttons={this.getSubmitButtons()}>
                {children}
            </AccordionListItemPiece>
        );
    }
});

export default IkonotvAccordionListItem;
