'use strict';

import React from 'react';
import Q from 'q';

import { escapeHTML } from '../../utils/general_utils';

import InjectInHeadMixin from '../../mixins/inject_in_head_mixin';
import Panel from 'react-bootstrap/lib/Panel';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import AppConstants from '../../constants/application_constants.js';

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
        let ext = this.props.url.split('.').pop();

        return (
            <Panel className="media-other">
                <p className="text-center">
                    .{ext}
                </p>
            </Panel>
        );
    }
});

let Image = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        preview: React.PropTypes.string.isRequired
    },

    mixins: [InjectInHeadMixin],

    componentDidMount() {
        this.inject('https://code.jquery.com/jquery-2.1.4.min.js')
            .then(() =>
                Q.all([
                    this.inject(AppConstants.baseUrl + 'static/thirdparty/shmui/shmui.css'),
                    this.inject(AppConstants.baseUrl + 'static/thirdparty/shmui/jquery.shmui.js')
                ]).then(() => { window.jQuery('.shmui-ascribe').shmui(); }));
    },

    render() {
        return (
            <img className="shmui-ascribe" src={this.props.preview} data-large-src={this.props.url}/>
        );
    }
});

let Audio = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired
    },

    mixins: [InjectInHeadMixin],

    componentDidMount() {
        this.inject(AppConstants.baseUrl + 'static/thirdparty/audiojs/audiojs/audio.min.js').then(this.ready);
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
     *
     * What we do is the following:
     * 1) set `state.ready = false`
     * 2) render the cover using the `<Image />` component (because ready is false)
     * 3) on `componentDidMount`, we load the external `css` and `js` resources using
     *    the `InjectInHeadMixin`, attaching a function to `Promise.then` to change
     *    `state.ready` to true
     * 4) when the promise is succesfully resolved, we change `state.ready` triggering
     *    a re-render
     * 5) the new render calls `prepareVideoHTML` to get the raw HTML of the video tag
     *    (that will be later processed and expanded by VideoJS)
     * 6) `componentDidUpdate` is called after `render`, setting `state.videoMounted` to true,
     *    to avoid re-installing the VideoJS library
     * 7) to close the lifecycle, `componentWillUnmount` is called removing VideoJS from the DOM.
     */

    propTypes: {
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array.isRequired,
        encodingStatus: React.PropTypes.number
    },

    mixins: [InjectInHeadMixin],

    getInitialState() {
        return { ready: false, videoMounted: false };
    },

    componentDidMount() {
        Q.all([
            this.inject('//vjs.zencdn.net/4.12/video-js.css'),
            this.inject('//vjs.zencdn.net/4.12/video.js')
        ]).then(this.ready);
    },

    componentDidUpdate() {
        if (this.state.ready && !this.state.videoMounted) {
            window.videojs('#mainvideo');
            /* eslint-disable */
            this.setState({videoMounted: true});
            /* eslint-enable*/
        }
    },

    componentWillUnmount() {
        window.videojs('#mainvideo').dispose();
    },

    ready() {
        this.setState({ready: true, videoMounted: false});
    },

    prepareVideoHTML() {
        let sources = this.props.extraData.map((data) => '<source type="video/' + data.type + '" src="' + escapeHTML(data.url) + '" />');
        let html = [
            '<video id="mainvideo" class="video-js vjs-default-skin" poster="' + escapeHTML(this.props.preview) + '"',
                   'controls preload="none" width="auto" height="auto">',
                   sources.join('\n'),
            '</video>'];
        return html.join('\n');
    },

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.videoMounted === false;
    },

    render() {
        if (this.state.ready) {
            return (
                <div dangerouslySetInnerHTML={{__html: this.prepareVideoHTML() }}/>
            );
        } else {
            return (
                <Image src={this.props.preview} />
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
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array,
        encodingStatus: React.PropTypes.number
    },

    render() {
        if (this.props.mimetype === 'video' && this.props.encodingStatus !== undefined && this.props.encodingStatus !== 100) {
            return (
                <div className="ascribe-detail-header ascribe-media-player">
                    <p>
                        <em>We successfully received your video and it is now being encoded.
                        <br />You can leave this page and check back on the status later.</em>
                    </p>
                    <ProgressBar now={this.props.encodingStatus}
                        label='%(percent)s%' />
                </div>
            );
        } else {
            let Component = resourceMap[this.props.mimetype] || Other;
            return (
                <div className="ascribe-media-player">
                    <Component preview={this.props.preview}
                               url={this.props.url}
                               extraData={this.props.extraData}
                               encodingStatus={this.props.encodingStatus} />
                </div>
            );
        }
    }
});

export default MediaPlayer;
