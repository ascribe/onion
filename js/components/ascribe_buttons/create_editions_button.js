'use strict';

import React from 'react';
import Router from 'react-router';

import Button from 'react-bootstrap/lib/Button';

import EditionDeleteForm from '../ascribe_forms/form_delete_edition';
import EditionRemoveFromCollectionForm from '../ascribe_forms/form_remove_editions_from_collection';
import ModalWrapper from '../ascribe_modal/modal_wrapper';
import AccordionListItemCreateEditions from './../ascribe_accordion_list/accordion_list_item_create_editions';
import GlobalNotificationModel from '../../models/global_notification_model';
import GlobalNotificationActions from '../../actions/global_notification_actions';

import { getAvailableAcls } from '../../utils/acl_utils';
import { getLangText } from '../../utils/lang_utils.js'

import EditionListActions from '../../actions/edition_list_actions';

let CreateEditionsButton = React.createClass({
    propTypes: {
        piece: React.PropTypes.object.isRequired
    },

    mixins: [Router.Navigation],

    render: function () {
        if (this.props.piece.constructor === Array){
            return null;
        }
        let availableAcls = getAvailableAcls([this.props.piece]);
        if (availableAcls.indexOf('editions') === -1){
            return null;
        }
        return (
            <button className="btn btn-default btn-sm">
                CREATE EDITIONS
            </button>
        );
    }
});

export default CreateEditionsButton;

