'use strict';

import React from 'react';

import { getLangText } from '../../../../../utils/lang_utils';


const MarketErrorConsignUnavailable = React.createClass({
    propTypes: {
        editions: React.PropTypes.array.isRequired,
        whitelabelName: React.PropTypes.string.isRequired,

        handleSuccess: React.PropTypes.func
    },

    render() {
        const { editions, handleSuccess, whitelabelName } = this.props;
        const multipleEditions = editions.length > 1;

        return (
            <div>
                <p>{getLangText("Well, it looks like you've caught us in a bit of a bind!")}</p>
                <p>
                    {getLangText('As a prerequisite, %s requires you to provide additional details before they will ' +
                                 "consider your consignment request. However, it looks like the %s that you're trying " +
                                 "to consign can't be edited anymore. Most likely, another Edition of the same work was " +
                                 'previously transferred by you or another person.',
                                 whitelabelName,
                                 multipleEditions ? 'Editions' : 'Edition')
                    }
                </p>
                <p>
                    {getLangText("Unfortunately, this means that we're unable to let you consign %s.",
                                 multipleEditions ? 'these Editions' : 'this Edition')}
                    {getLangText('If this seems incorrect, or if you would still like to consign %s to %s, please ',
                                 multipleEditions ? 'these Editions' : 'this Edition',
                                 whitelabelName)}
                    <strong><a style={{ cursor: 'pointer' }} href="mailto:support@ascribe.io">{getLangText('contact us')}</a></strong>.
                </p>
                <button className='btn btn-default btn-wide' onClick={handleSuccess}>
                    {getLangText('OK')}
                </button>
            </div>
        );
    }
});

export default MarketErrorConsignUnavailable;
