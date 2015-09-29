'use strict';

import React from 'react';

let GlobalAction = React.createClass({
    propTypes: {
        requestActions: React.PropTypes.object
    },

    render() {
        let pieceActions = null;
        if (this.props.requestActions && this.props.requestActions.pieces){
            pieceActions = this.props.requestActions.pieces.map((item) => {
                return (
                    <div className="ascribe-global-action">
                        {item}
                    </div>);
            });
        }
        let editionActions = null;
        if (this.props.requestActions && this.props.requestActions.editions){
            editionActions = Object.keys(this.props.requestActions.editions).map((pieceId) => {
                return this.props.requestActions.editions[pieceId].map((item) => {
                    return (
                        <div className="ascribe-global-action">
                            {item}
                        </div>);
                });
            });
        }

        if (pieceActions || editionActions) {
            return (
                <div className="ascribe-global-action-wrapper">
                    {pieceActions}
                    {editionActions}
                </div>);
        }
        return null;
    }
});

export default GlobalAction;