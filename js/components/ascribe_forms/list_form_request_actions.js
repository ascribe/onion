'use strict';

import React from 'react';
import RequestActionForm from './form_request_action';

let ListRequestActions = React.createClass({
    propTypes: {
        notifications: React.PropTypes.array.isRequired,
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,

        handleSuccess: React.PropTypes.func
    },

    render () {
        const { handleSuccess, notifications, pieceOrEditions } = this.props;

        if (notifications.length) {
            return (
                <div>
                    {notifications.map((notification) =>
                        <RequestActionForm
                            handleSuccess={handleSuccess}
                            notifications={notification}
                            pieceOrEditions={pieceOrEditions} />
                    )}
                </div>
            );
        } else {
            return null;
        }
    }
});

export default ListRequestActions;
