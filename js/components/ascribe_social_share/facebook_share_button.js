'use strict';

import React from 'react';

import FacebookHandler from '../../third_party/facebook_handler';

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

    getInitialState() {
        return FacebookHandler.getState();
    },

    componentDidMount() {
        FacebookHandler.listen(this.onChange);

        this.loadFacebook();
    },

    shouldComponentUpdate(nextProps, nextState) {
        // Don't update if the props haven't changed or the FB SDK loading status is still the same
        return this.props.type !== nextProps.type || nextState.loaded !== this.state.loaded;
    },

    componentDidUpdate() {
        // If the component changes, we need to reparse the share button's XFBML.
        // To prevent cases where the Facebook SDK hasn't been loaded yet at this stage,
        // let's make sure that it's injected before trying to reparse.
        this.loadFacebook();
    },

    onChange(state) {
        this.setState(state);
    },

    loadFacebook() {
        InjectInHeadUtils
            .inject(AppConstants.facebook.sdkUrl)
            .then(() => {
                if (this.state.loaded) {
                    FB.XFBML.parse(this.refs.fbShareButton.getDOMNode().parent)
                }
            });
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
