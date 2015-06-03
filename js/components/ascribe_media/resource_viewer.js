import React from 'react';
import InjectInHeadMixin from '../../mixins/inject_in_head_mixin';

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


let Image = React.createClass({
    render() {
        return (<img className="img-responsive" src={this.props.preview} />);
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
    'video': Video
}

let ResourceViewer = React.createClass({
    propTypes: {
        mimetype: React.PropTypes.oneOf(['image', 'video', 'audio', 'pdf', 'other']).isRequired,
        preview: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired
    },

    render() {
        let Component = resourceMap[this.props.mimetype] || Image;

        return (
            <div className="media">
                <Component preview={this.props.preview}
                           url={this.props.url}
                           extraData={this.props.extraData} />
            </div>
        );
    }
});

export default ResourceViewer;
