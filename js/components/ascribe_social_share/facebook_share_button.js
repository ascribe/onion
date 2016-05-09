'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject_utils';

let FacebookShareButton = React.createClass({
    propTypes: {
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

        InjectInHeadUtils
            .inject(AppConstants.facebook.sdkUrl)
            .then(() => { FB.XFBML.parse(ReactDOM.findDOMNode(this.refs.fbShareButton).parentElement) });
    },

    shouldComponentUpdate(nextProps) {
        return this.props.type !== nextProps.type;
    },

    render() {
        return (
            <span
                ref="fbShareButton"
                className="fb-share-button btn btn-ascribe-social"
                data-layout={this.props.type}>
            </span>
        );
    }
});

export default FacebookShareButton;
