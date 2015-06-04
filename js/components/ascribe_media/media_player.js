import React from 'react';
import InjectInHeadMixin from '../../mixins/inject_in_head_mixin';
import Panel from 'react-bootstrap/lib/Panel';

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
    render() {
        return (
            <a href={this.props.url} target="_blank" >
                <img src={this.props.preview} />
            </a>
        );
    }
});

let Video = React.createClass({
    propTypes: {
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        extraData: React.PropTypes.array.isRequired
    },

    mixins: [InjectInHeadMixin],

    getInitialState() {
        return { ready: false };
    },

    componentDidMount() {
        this.inject('http://code.jquery.com/jquery-2.1.4.min.js')
            .then(() =>
                Promise.all([
                    this.inject('https://cdnjs.cloudflare.com/ajax/libs/mediaelement/2.17.0/mediaelement-and-player.min.js'),
                    this.inject('https://cdnjs.cloudflare.com/ajax/libs/mediaelement/2.17.0/mediaelementplayer.min.css')
                ]).then(() => { this.setState({ready: true}); }));
    },

    render() {
        if (this.state.ready) {
            return (
                <video poster={this.props.preview} controls="controls" preload="none">
                    {this.props.extraData.map((data, i) =>
                    <source key={i} type={'video/' + data.type} src={data.url} />
                    )}
                </video>
            );
        } else {
            return(
                <Image src={this.props.preview} />
            );
        }
    }
});


let resourceMap = {
    'image': Image,
    'video': Video,
    'other': Other
}

let MediaPlayer = React.createClass({
    propTypes: {
        mimetype: React.PropTypes.oneOf(['image', 'video', 'audio', 'pdf', 'other']).isRequired,
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired
    },

    render() {
        let Component = resourceMap[this.props.mimetype] || Other;

        return (
            <div className="ascribe-media-player">
                <Component preview={this.props.preview}
                           url={this.props.url}
                           extraData={this.props.extraData} />
            </div>
        );
    }
});

export default MediaPlayer;
