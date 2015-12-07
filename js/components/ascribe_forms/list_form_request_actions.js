'use strict';

import React from 'react';
import RequestActionForm from './form_request_action';

let ListRequestActions = React.createClass({

    propTypes: {
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        currentUser: React.PropTypes.object,
        handleSuccess: React.PropTypes.func.isRequired,
        notifications: React.PropTypes.array.isRequired
    },

    render () {
        if (this.props.notifications &&
            this.props.notifications.length > 0) {
            return (
                <div>
                    {this.props.notifications.map((notification) =>
                        <RequestActionForm
                            currentUser={this.props.currentUser}
                            pieceOrEditions={ this.props.pieceOrEditions }
                            notifications={notification}
                            handleSuccess={this.props.handleSuccess}/>)}
                </div>
            );
        }
        return null;
    }
});

export default ListRequestActions;
