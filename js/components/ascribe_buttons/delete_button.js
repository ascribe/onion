'use strict';

import React from 'react';
import Router from 'react-router';

import Button from 'react-bootstrap/lib/Button';

import EditionDeleteForm from '../ascribe_forms/form_delete_edition';
import EditionRemoveFromCollectionForm from '../ascribe_forms/form_remove_editions_from_collection';
import ModalWrapper from '../ascribe_modal/modal_wrapper';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getAvailableAcls } from '../../utils/acl_utils';
import { getLangText } from '../../utils/lang_utils.js';

import EditionListActions from '../../actions/edition_list_actions';

let DeleteButton = React.createClass({
    propTypes: {
        editions: React.PropTypes.array.isRequired
    },

    mixins: [Router.Navigation],

    showNotification(response) {
        this.props.editions
            .forEach((edition) => {
                EditionListActions.fetchEditionList(edition.parent);
            });
        EditionListActions.clearAllEditionSelections();
        EditionListActions.closeAllEditionLists();
        this.transitionTo('pieces');
        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render: function () {
        let availableAcls = getAvailableAcls(this.props.editions);
        let btnDelete = null;
        let content = null;

        if (availableAcls.acl_delete) {
            content = <EditionDeleteForm editions={ this.props.editions }/>;
            btnDelete = <Button bsStyle="danger" className="btn-delete" bsSize="small">{getLangText('DELETE')}</Button>;
        }
        else if (availableAcls.acl_unshare){
            content = <EditionRemoveFromCollectionForm editions={ this.props.editions }/>;
            btnDelete = <Button bsStyle="danger" className="btn-delete" bsSize="small">{getLangText('REMOVE FROM COLLECTION')}</Button>;
        }
        else{
            return null;
        }
        return (
            <ModalWrapper
                button={ btnDelete }
                handleSuccess={ this.showNotification }
                title={getLangText('Remove Edition')}
                tooltip={getLangText('Click to remove edition')}>
                { content }
            </ModalWrapper>
        );
    }
});

export default DeleteButton;

