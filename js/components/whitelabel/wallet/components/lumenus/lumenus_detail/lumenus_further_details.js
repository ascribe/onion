'use strict';

import React from 'react';

import LumenusAdditionalDataForm from '../lumenus_forms/lumenus_additional_data_form'

import GlobalNotificationModel from '../../../../../../models/global_notification_model';
import GlobalNotificationActions from '../../../../../../actions/global_notification_actions';

let FurtherDetails = React.createClass({
    propTypes: {
        pieceId: React.PropTypes.number,
        extraData: React.PropTypes.object,
        otherData: React.PropTypes.arrayOf(React.PropTypes.object),
        handleSuccess: React.PropTypes.func,
        location: React.PropTypes.object
    },

    showNotification() {
        this.props.handleSuccess();
        let notification = new GlobalNotificationModel('Further details updated', 'success');
        GlobalNotificationActions.appendGlobalNotification(notification);
    },

    render() {
        const { pieceId, extraData, otherData, handleSuccess, location } = this.props;

        // Instead of grabbing the entire piece from the PieceStore and making this component
        // stateful, we can put together a piece for the additional form solely based on the props
        const piece = {
            id: pieceId,
            extra_data: extraData,
            other_data: otherData
        };

        return (
            <LumenusAdditionalDataForm
                piece={piece}
                handleSuccess={this.showNotification}
                isInline
                location={location} />
        );
    }
});

export default FurtherDetails;
