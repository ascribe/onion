'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import MediaPlayer from './../ascribe_media/media_player';

import CollapsibleButton from './../ascribe_collapsible/collapsible_button';

import AclProxy from '../acl_proxy';


let MediaContainer = React.createClass({
    propTypes: {
        digitalWork: React.PropTypes.object.isRequired,
        thumbnail: React.PropTypes.string
    },

    getEmbed() {
        if (['video', 'audio'].indexOf(mimetype) > -1) {
            return (
                <CollapsibleButton
                    button={
                        <Button bsSize="xsmall" className="ascribe-margin-1px">
                            Embed
                        </Button>
                    }
                    panel={
                        <pre className="">
                            {'<iframe width="560" height="315" src="http://embed.ascribe.io/content/'
                                + this.props.content.bitcoin_id + '" frameborder="0" allowfullscreen></iframe>'
                            }
                        </pre>
                    }/>
            );
        }
    },

    render() {
        if(!this.props.digitalWork) {
            return null;
        }

        let extraData = null;

        if (this.props.digitalWork.encoding_urls) {
            extraData = this.props.digitalWork.encoding_urls.map(e => { return { url: e.url, type: e.label }; });
        }

        return (
            <div>
                <MediaPlayer
                    mimetype={this.props.digitalWork.mime}
                    preview={this.props.thumbnail}
                    url={this.props.digitalWork.url}
                    extraData={extraData} />
                <p className="text-center">
                    <AclProxy
                        aclObject={this.props.content.acl}
                        aclName="acl_download">
                        <Button bsSize="xsmall" className="ascribe-margin-1px" href={this.props.digitalWork.url} target="_blank">
                            Download <Glyphicon glyph="cloud-download"/>
                        </Button>
                    </AclProxy>
                    {this.getEmbed()}
                </p>
            </div>
        );
    }
});

export default MediaContainer;
