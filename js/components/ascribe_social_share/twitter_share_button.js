'use strict';

import React from 'react';

import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject_utils';

let TwitterShareButton = React.createClass({
    propTypes: {
        count: React.PropTypes.string,
        counturl: React.PropTypes.string,
        hashtags: React.PropTypes.string,
        size: React.PropTypes.string,
        text: React.PropTypes.string,
        url: React.PropTypes.string,
        via: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            count: 'none'
        };
    },

    componentDidMount() {
        InjectInHeadUtils.inject(AppConstants.twitter.sdkUrl).then(this.loadTwitterButton);
    },

    loadTwitterButton() {
        const { count, counturl, hashtags, size, text, url, via } = this.props;

        twttr.widgets.createShareButton(url, this.refs.twitterShareButton.getDOMNode(), {
            count,
            counturl,
            hashtags,
            size,
            text,
            via,
            dnt: true   // Do not track
        });
    },

    render() {
        return (
            <span
                ref="twitterShareButton"
                className="btn btn-ascribe-social">
            </span>
        );
    }
});

export default TwitterShareButton;
