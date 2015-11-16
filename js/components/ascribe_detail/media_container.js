'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import MediaPlayer from './../ascribe_media/media_player';

import CollapsibleButton from './../ascribe_collapsible/collapsible_button';

import AclProxy from '../acl_proxy';


const EMBED_IFRAME_HEIGHT = {
    video: 315,
    audio: 62
};

let MediaContainer = React.createClass({
    propTypes: {
        content: React.PropTypes.object,
        refreshObject: React.PropTypes.func
    },

    getInitialState() {
        return {timerId: null};
    },

    componentDidMount() {
        if (!this.props.content.digital_work) {
            return;
        }
        let isEncoding = this.props.content.digital_work.isEncoding;
        if (this.props.content.digital_work.mime === 'video' && typeof isEncoding === 'number' && isEncoding !== 100 && !this.state.timerId) {
            let timerId = window.setInterval(this.props.refreshObject, 10000);
            this.setState({timerId: timerId});
        }
    },

    componentWillUpdate() {
        if (this.props.content.digital_work.isEncoding === 100) {
            window.clearInterval(this.state.timerId);
        }
    },

    componentWillUnmount() {
        window.clearInterval(this.state.timerId);
    },

    render() {
        let thumbnail = this.props.content.thumbnail.thumbnail_sizes && this.props.content.thumbnail.thumbnail_sizes['600x600'] ?
            this.props.content.thumbnail.thumbnail_sizes['600x600'] : this.props.content.thumbnail.url_safe;
        let mimetype = this.props.content.digital_work.mime;
        let embed = null;
        let extraData = null;
        let isEmbedDisabled = mimetype === 'video' && this.props.content.digital_work.isEncoding !== undefined && this.props.content.digital_work.isEncoding !== 100;

        if (this.props.content.digital_work.encoding_urls) {
            extraData = this.props.content.digital_work.encoding_urls.map(e => { return { url: e.url, type: e.label }; });
        }

        if (['video', 'audio'].indexOf(mimetype) > -1) {
            let height = EMBED_IFRAME_HEIGHT[mimetype];

            embed = (
                <CollapsibleButton
                    button={
                        <Button bsSize="xsmall" className="ascribe-margin-1px" disabled={isEmbedDisabled ? '"disabled"' : ''}>
                            Embed
                        </Button>
                    }
                    panel={
                        <pre className="">
                            {'<iframe width="560" height="' + height + '" src="https://embed.ascribe.io/content/'
                                + this.props.content.bitcoin_id + '" frameborder="0" allowfullscreen></iframe>'}
                        </pre>
                    }/>
            );
        }
        return (
            <div>
                <MediaPlayer
                    mimetype={mimetype}
                    preview={thumbnail}
                    url={this.props.content.digital_work.url}
                    extraData={extraData}
                    encodingStatus={this.props.content.digital_work.isEncoding} />
                <p className="text-center">
                    <AclProxy
                        show={['video', 'audio', 'image'].indexOf(mimetype) === -1 || this.props.content.acl.acl_download}
                        aclObject={this.props.content.acl}
                        aclName="acl_download">
                        <Button bsSize="xsmall" className="ascribe-margin-1px" href={this.props.content.digital_work.url} target="_blank">
                            Download .{mimetype} <Glyphicon glyph="cloud-download"/>
                        </Button>
                    </AclProxy>
                    {embed}
                </p>
            </div>
        );
    }
});

export default MediaContainer;
