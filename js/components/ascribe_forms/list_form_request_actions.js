'use strict';

import React from 'react';
import RequestActionForm from './form_request_action';

let ListRequestActions = React.createClass({

    propTypes: {
        pieceOrEditions: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]).isRequired,
        currentUser: React.PropTypes.object.isRequired,
        handleSuccess: React.PropTypes.func.isRequired,
        requestActions: React.PropTypes.array.isRequired
    },

    render () {
        if (this.props.requestActions &&
            this.props.requestActions.length > 0) {
            return (
                <div>
                    {this.props.requestActions.map((requestAction) =>
                        <RequestActionForm
                            currentUser={this.props.currentUser}
                            pieceOrEditions={ this.props.pieceOrEditions }
                            requestAction={requestAction.action}
                            requestUser={requestAction.by}
                            handleSuccess={this.props.handleSuccess}/>)}
                </div>
            );
        }
        return null;
    }
});

export default ListRequestActions;