'use strict';

import React from 'react';
import classNames from 'classnames';


import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';
import UserActions from '../../../../../../actions/user_actions';
import UserStore from '../../../../../../stores/user_store';
import WhitelabelActions from '../../../../../../actions/whitelabel_actions';
import WhitelabelStore from '../../../../../../stores/whitelabel_store';

import ConsignForm from '../../../../../ascribe_forms/form_consign';

import ModalWrapper from '../../../../../ascribe_modal/modal_wrapper';

import ApiUrls from '../../../../../../constants/api_urls';

import { getAclFormMessage, getAclFormDataId } from '../../../../../../utils/form_utils';
import { mergeOptions } from '../../../../../../utils/general_utils';
import { getLangText } from '../../../../../../utils/lang_utils';

let LumenusSubmitButton = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        editions: React.PropTypes.array,
        handleSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return mergeOptions(
            UserStore.getState(),
            WhitelabelStore.getState()
        );
    },

    componentDidMount() {
        UserStore.listen(this.onChange);
        UserActions.fetchCurrentUser();
        WhitelabelStore.listen(this.onChange);
        WhitelabelActions.fetchWhitelabel();
    },

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        WhitelabelStore.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    showNotification(response) {
        this.props.handleSuccess();
        if (response.notification) {
            let notification = new GlobalNotificationModel(response.notification, 'success');
            GlobalNotificationActions.appendGlobalNotification(notification);
        }
    },

    render() {
        const { className, editions, handleSuccess } = this.props;
        const title = getLangText('Consign to Lumenus');
        const message = getAclFormMessage({
            aclName: 'acl_consign',
            entities: editions,
            isPiece: false,
            senderName: this.state.currentUser.username
        });

        return (
            <ModalWrapper
                trigger={
                    <button className={classNames('btn', 'btn-default', 'btn-sm', className)}>
                        {title}
                    </button>
                }
                handleSuccess={this.showNotification}
                title={title}>
                <ConsignForm
                    email={this.state.whitelabel.user}
                    message={message}
                    id={getAclFormDataId(false, editions)}
                    url={ApiUrls.ownership_consigns}/>
            </ModalWrapper>
        );
    }
});

export default LumenusSubmitButton;
