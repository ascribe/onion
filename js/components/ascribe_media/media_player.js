'use strict';

import React from 'react';
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
                Promise.all([
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
    propTypes: {
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array.isRequired,
        encodingStatus: React.PropTypes.number
    },

    mixins: [InjectInHeadMixin],

    getInitialState() {
        return { ready: false };
    },

    componentDidMount() {
        Promise.all([
            this.inject('//vjs.zencdn.net/4.12/video-js.css'),
            this.inject('//vjs.zencdn.net/4.12/video.js')
        ]).then(this.ready);
    },

    componentDidUpdate() {
        if (this.state.ready && !this.state.videojs) {
            window.videojs(React.findDOMNode(this.refs.video));
        }
    },

    ready() {
        this.setState({ready: true, videojs: false});
    },

    render() {
        if (this.state.ready) {
            return (
                <video ref="video" className="video-js vjs-default-skin" poster={this.props.preview}
                       controls preload="none" width="auto" height="auto">
                    {this.props.extraData.map((data, i) =>
                    <source key={i} type={'video/' + data.type} src={data.url} />
                    )}
                </video>
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
                    <p><em>Please be patient, the video is being encoded</em></p>
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
