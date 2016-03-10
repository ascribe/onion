'use strict';

import React from 'react';
import Q from 'q';

import Panel from 'react-bootstrap/lib/Panel';

import AppConstants from '../../constants/application_constants';

import { escapeHTML } from '../../utils/general_utils';
import { InjectInHeadUtils } from '../../utils/inject_utils';

/**
 * This is the component that implements display-specific functionality.
 *
 * ResourceViewer handles the following mimetypes:
 *  - image
 *  - video
 *  - audio
 *  - pdf
 *  - other
 */


let Other = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired
    },

    render() {
        let filename = this.props.url.split('/').pop();
        let tokens = filename.split('.');
        let thumbnail;

        if (tokens.length > 1) {
            thumbnail = '.' + tokens.pop();
        } else {
            thumbnail = 'file';
        }

        return (
            <Panel className="media-other">
                <p className="text-center">
                    {thumbnail}
                </p>
            </Panel>
        );
    }
});

let Image = React.createClass({
    propTypes: {
        url: React.PropTypes.string,
        thumbnail: React.PropTypes.string.isRequired
    },

    componentDidMount() {
        if (this.props.url) {
            InjectInHeadUtils.inject(AppConstants.jquery.sdkUrl)
                .then(() =>
                    Q.all([
                        InjectInHeadUtils.inject(AppConstants.shmui.cssUrl),
                        InjectInHeadUtils.inject(AppConstants.shmui.sdkUrl)
                    ]).then(() => { window.jQuery('.shmui-ascribe').shmui(); }));
        }
    },

    render() {
        const { url, thumbnail } = this.props;

        if (url) {
            return (
                <img className="shmui-ascribe" src={thumbnail} data-large-src={url} />
            );
        } else {
            return (
                <img src={thumbnail} />
            );
        }
    }
});

let Audio = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired
    },

    componentDidMount() {
        InjectInHeadUtils.inject(AppConstants.audiojs.sdkUrl).then(this.ready);
    },

    ready() {
        window.audiojs.events.ready(function() {
            window.audiojs.createAll();
        });
    },

    render() {
        return (
            <audio className="ascribe-audio" src={this.props.url} preload="auto" />
        );
    }
});


let Video = React.createClass({
    /**
     * The solution here is a bit convoluted.
     * ReactJS is responsible for DOM manipulation but VideoJS updates the DOM
     * to install itself to display the video, therefore ReactJS complains that we are
     * changing the DOM under its feet.
     * The component supports a fall-back to HTML5 video tag.
     *
     * What we do is the following:
     * 1) set `state.libraryLoaded = null` (state.libraryLoaded can be in three states: `null`
     *    if we don't know anything about it, `true` if the external library has been loaded,
     *    `false` if we failed to load the external library)
     * 2) render the cover using the `<Image />` component (because libraryLoaded is null)
     * 3) on `componentDidMount`, we load the external `css` and `js` resources using
     *    the `InjectInHeadUtils`, attaching a function to `Promise.then` to change
     *    `state.libraryLoaded` to true
     * 4) when the promise is succesfully resolved, we change `state.libraryLoaded` triggering
     *    a re-render
     * 5) the new render calls `prepareVideoHTML` to get the raw HTML of the video tag
     *    (that will be later processed and expanded by VideoJS)
     * 6) `componentDidUpdate` is called after `render`, setting `state.videoMounted` to true,
     *    to avoid re-installing the VideoJS library
     * 7) to close the lifecycle, `componentWillUnmount` is called removing VideoJS from the DOM.
     */

    propTypes: {
        thumbnail: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array.isRequired
    },

    getInitialState() {
        return { libraryLoaded: null, videoMounted: false };
    },

    componentDidMount() {
        Q.all([
            InjectInHeadUtils.inject(AppConstants.videojs.cssUrl),
            InjectInHeadUtils.inject(AppConstants.videojs.sdkUrl)])
        .then(() => this.setState({libraryLoaded: true}))
        .fail(() => this.setState({libraryLoaded: false}));
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.videoMounted === false;
    },

    componentDidUpdate() {
        if (this.state.libraryLoaded && !this.state.videoMounted) {
            window.videojs('#mainvideo');
            /* eslint-disable */
            this.setState({videoMounted: true});
            /* eslint-enable*/
        }
    },

    componentWillUnmount() {
        if (this.state.videoMounted) {
            window.videojs('#mainvideo').dispose();
        }
    },

    prepareVideoHTML() {
        let sources = this.props.extraData.map((data) => '<source type="video/' + data.type + '" src="' + escapeHTML(data.url) + '" />');
        let html = [
            '<video id="mainvideo" class="video-js vjs-default-skin" poster="' + escapeHTML(this.props.thumbnail) + '"',
                   'controls preload="none" width="auto" height="auto">',
                   sources.join('\n'),
            '</video>'];
        return html.join('\n');
    },

    render() {
        if (this.state.libraryLoaded !== null) {
            return (
                <div dangerouslySetInnerHTML={{__html: this.prepareVideoHTML() }}/>
            );
        } else {
            return (
                <Image thumbnail={this.props.thumbnail} />
            );
        }
    }
});

let resourceMap = {
    'image': Image,
    'video': Video,
    'audio': Audio,
    'other': Other
};

let MediaPlayer = React.createClass({
    propTypes: {
        mimetype: React.PropTypes.oneOf(['image', 'video', 'audio', 'pdf', 'other']).isRequired,
        thumbnail: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array,
        encodingMessage: React.PropTypes.node
    },

    render() {
        const {
            mimetype,
            thumbnail,
            url,
            extraData,
            encodingMessage
        } = this.props;

        if (encodingMessage) {
            return encodingMessage;
        } else {
            let Component = resourceMap[mimetype] || Other;
            let componentProps = {
                thumbnail,
                url,
                extraData,
            };

            // Since the launch of the portfolio whitelabel submission,
            // we allow the user to specify a thumbnail upon piece-registration.
            // As the `Component` is chosen according to its filetype but could potentially
            // have a manually submitted thumbnail, we match if the to `Mediaplayer` submitted thumbnail
            // is not the generally used fallback `url` (ascribe_spiral.png).
            //
            // If this is the case, we disable shmui by deleting the original `url` prop and replace
            // the assigned component to `Image`.
            if (!decodeURIComponent(thumbnail).match(/https:\/\/.*\/media\/thumbnails\/ascribe_spiral.png/) &&
               Component === Other) {
                Component = resourceMap.image;
                delete componentProps.url;
            }

            return (
                <div className="ascribe-media-player">
                    <Component {...componentProps}/>
                </div>
            );
        }
    }
});

export default MediaPlayer;
