'use strict'

import React from 'react';

import { getLangText } from '../../../../../utils/lang_utils';

let MarketConsignError = React.createClass({
    propTypes: {
        handleSuccess: React.PropTypes.func,
        whitelabelName: React.PropTypes.string
    },

    handleSuccess() {
        const { handleSuccess, whitelabelName } = this.props;

        /* eslint-disable */
        Intercom('showNewMessage', getLangText("I'm having trouble consigning my edition to %s because I don't " +
                                               "have the permissions to edit its details.", whitelabelName));
        /* eslint-enable */

        if (typeof handleSuccess === 'function') {
            handleSuccess();
        }
    },

    render() {
        const { handleSuccess, whitelabelName } = this.props;

        return (
            <div className="ascribe-form-error-popup">
                <div className="error-popup-content">
                    <p>
                        {getLangText('Unfortunately, %s requires you to provide more information ' +
                                     "about this edition, but it appears that you don't have the " +
                                     'permissions to edit the piece associated with this edition.', whitelabelName)}
                    </p>
                    <p>
                        {getLangText('Please contact us if you would still like to consign this piece to %s.', whitelabelName)}
                    </p>
                </div>
                <button
                    onClick={this.handleSuccess}
                    className="btn btn-default btn-wide">
                    {getLangText('Contact us for help')}
                </button>
            </div>
        );
    }
});

export default MarketConsignError;
