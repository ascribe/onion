import React from 'react';
import Router from 'react-router';

import Button from 'react-bootstrap/lib/Button';

import EditionDeleteForm from '../ascribe_forms/form_delete_edition';
import ModalWrapper from '../ascribe_modal/modal_wrapper';

import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

let DeleteButton = React.createClass({
    propTypes: {
        editions: React.PropTypes.array.isRequired,
    },

    mixins: [Router.Navigation],

    showNotification(response){
        this.transitionTo('pieces');
        let notification = new GlobalNotificationModel(response.notification, 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },
    render: function () {
        let btnDelete = null;
        let content = <EditionDeleteForm />;
        if (this.props.edition.acl.indexOf('delete') > -1) {
            btnDelete = <Button bsStyle="danger">Delete this edition</Button>;
        }
        else if (this.props.edition.acl.indexOf('del_from_collection') > -1){
            btnDelete = <Button bsStyle="danger">Remove this artwork from your list</Button>;
        }
        else{
            return <div></div>;
        }
        return (
            <ModalWrapper
                button={ btnDelete }
                currentUser={ this.props.currentUser }
                editions={ [this.props.edition] }
                handleSuccess={ this.showNotification }
                title='Remove Edition'
                tooltip='Click to remove edition'>
                { content }
            </ModalWrapper>
        );
    }
});

export default DeleteButton;

