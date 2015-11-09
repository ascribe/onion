'use strict';

import React from 'react';

import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject_utils';

let FacebookShareButton = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        type: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            type: 'button'
        };
    },

    componentDidMount() {
        /**
         * Ideally we would only use FB.XFBML.parse() on the component that we're
         * mounting, but doing this when we first load the FB sdk causes unpredictable behaviour.
         * The button sometimes doesn't get initialized, likely because FB hasn't properly
         * been initialized yet.
         *
         * To circumvent this, we always have the sdk parse the entire DOM on the initial load
         * (see FacebookHandler) and then use FB.XFBML.parse() on the mounting component later.
         */
        if (!InjectInHeadUtils.isPresent('script', AppConstants.facebook.sdkUrl)) {
            InjectInHeadUtils.inject(AppConstants.facebook.sdkUrl);
        } else {
            // Parse() searches the children of the element we give it, not the element itself.
            FB.XFBML.parse(this.refs.fbShareButton.getDOMNode().parentElement);
        }
    },

    render() {
        return (
            <span
                ref="fbShareButton"
                className="fb-share-button btn btn-ascribe-social"
                data-href={this.props.url}
                data-layout={this.props.type}>
           </span>
        );
    }
});

export default FacebookShareButton;
