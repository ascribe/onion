'use strict'

import React from 'react';

import { getLangText } from '../../../../../../utils/lang_utils';

const PrizeAdvanceRoundModal = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        handleCancel: React.PropTypes.func
    },

    render() {
        const { handleCancel, handleSuccess } = this.props;

        return (
            <div className="clearfix">
                <div className="ascribe-modal-content">
                    <p>
                        {getLangText('Are you sure you want to advance to the next round of judging?')}
                    </p>
                    <p>
                        {getLangText('Advancing will keep only the currently selected pieces for review in the next round. ' +
                                     'Ratings associated with each piece will be reset and all currently active jury members will be deactivated as well.')}
                    </p>
                    {/* Remove once api is up */}
                    <p>
                        <strong>{getLangText('Note: Advancing to the next round will only be available after submissions end on Dec. 27th.')}</strong>
                    </p>
                </div>
                <div
                    className="col-xs-6 ascribe-btn-container-left">
                    {/* Remove disabled from here too */}
                    <button
                        disabled
                        onClick={handleSuccess}
                        className="btn btn-default btn-wide">
                        {getLangText('Advance')}
                    </button>
                </div>
                <div className="col-xs-6 ascribe-btn-container-right">
                    <button
                        onClick={handleCancel}
                        className="btn btn-secondary btn-wide">
                        {getLangText('Cancel')}
                    </button>
                </div>
            </div>
        );
    }
});

export default PrizeAdvanceRoundModal;
