'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import MediaPlayer from './../ascribe_media/media_player';

import FacebookShareButton from '../ascribe_social_share/facebook_share_button';
import TwitterShareButton from '../ascribe_social_share/twitter_share_button';

import CollapsibleButton from './../ascribe_collapsible/collapsible_button';

import AclProxy from '../acl_proxy';

import { getLangText } from '../../utils/lang_utils';
import { extractFileExtensionFromString } from '../../utils/file_utils';


const EMBED_IFRAME_HEIGHT = {
    video: 315,
    audio: 62
};
const ENCODE_UPDATE_TIME = 5000;

let MediaContainer = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired,
        refreshObject: React.PropTypes.func.isRequired,

        currentUser: React.PropTypes.object
    },

    getInitialState() {
        return {
            timerId: null
        };
    },

    componentDidMount() {
        const { content: { digital_work: digitalWork }, refreshObject } = this.props;

        if (digitalWork) {
            const isEncoding = digitalWork.isEncoding;

            if (digitalWork.mime === 'video' && typeof isEncoding === 'number' && isEncoding !== 100 && !this.state.timerId) {
                this.setState({
                    timerId: window.setInterval(refreshObject, ENCODE_UPDATE_TIME)
                });
            }
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
        const { content, currentUser } = this.props;
        // Pieces and editions are joined to the user by a foreign key in the database, so
        // the information in content will be updated if a user updates their username.
        // We also force uniqueness of usernames, so this check is safe to dtermine if the
        // content was registered by the current user.
        const didUserRegisterContent = currentUser && (currentUser.username === content.user_registered);

        // We want to show the file's extension as a label of the download button.
        // We can however not only use `extractFileExtensionFromString` on the url for that
        // as files might be saved on S3 without a file extension which leads
        // `extractFileExtensionFromString` to extract everything starting from the top level
        // domain: e.g. '.net/live/<hash>'.
        // Therefore, we extract the file's name (last part of url, separated with a slash)
        // and try to extract the file extension from there.
        const fileName = content.digital_work.url.split('/').pop();
        const fileExtension = extractFileExtensionFromString(fileName);

        let thumbnail = content.thumbnail.thumbnail_sizes && content.thumbnail.thumbnail_sizes['600x600'] ?
            content.thumbnail.thumbnail_sizes['600x600'] : content.thumbnail.url_safe;
        let mimetype = content.digital_work.mime;
        let embed = null;
        let extraData = null;
        let isEmbedDisabled = mimetype === 'video' && content.digital_work.isEncoding !== undefined && content.digital_work.isEncoding !== 100;

        if (content.digital_work.encoding_urls) {
            extraData = content.digital_work.encoding_urls.map(e => { return { url: e.url, type: e.label }; });
        }

        if (['video', 'audio'].indexOf(mimetype) > -1) {
            let height = EMBED_IFRAME_HEIGHT[mimetype];

            embed = (
                <CollapsibleButton
                    button={
                        <Button
                            bsSize="xsmall"
                            className="ascribe-margin-1px"
                            disabled={isEmbedDisabled}>
                            {getLangText('Embed')}
                        </Button>
                    }
                    panel={
                        <pre className="">
                            {'<iframe width="560" height="' + height + '" src="https://embed.ascribe.io/content/'
                                + content.bitcoin_id + '" frameborder="0" allowfullscreen></iframe>'}
                        </pre>
                    } />
            );
        }
        return (
            <div>
                <MediaPlayer
                    mimetype={mimetype}
                    preview={thumbnail}
                    url={content.digital_work.url}
                    extraData={extraData}
                    encodingStatus={content.digital_work.isEncoding} />
                <p className="text-center hidden-print">
                    <span className="ascribe-social-button-list">
                        <FacebookShareButton />
                        <TwitterShareButton
                            text={getLangText('Check out %s ascribed piece', didUserRegisterContent ? 'my latest' : 'this' )} />
                    </span>

                    <AclProxy
                        show={['video', 'audio', 'image'].indexOf(mimetype) === -1 || content.acl.acl_download}
                        aclObject={content.acl}
                        aclName="acl_download">
                        <a
                            download
                            className="btn btn-xs btn-default ascribe-margin-1px"
                            href={content.digital_work.url}
                            target="_blank">
                            {/*
                                If it turns out that `fileExtension` is an empty string, we're just
                                using the label 'file'.
                            */}
                            {getLangText('Download')} .{fileExtension || 'file'} <Glyphicon glyph="cloud-download" />
                        </a>
                    </AclProxy>
                    {embed}
                </p>
            </div>
        );
    }
});

export default MediaContainer;
