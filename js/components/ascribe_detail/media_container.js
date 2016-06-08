'use strict';

import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

import MediaPlayer from './../ascribe_media/media_player';

import FacebookShareButton from '../ascribe_social_share/facebook_share_button';
import TwitterShareButton from '../ascribe_social_share/twitter_share_button';

import S3DownloadButton from '../ascribe_buttons/s3_download_button';

import CollapsibleButton from './../ascribe_collapsible/collapsible_button';

import AscribeSpinner from '../ascribe_spinner';

import AclProxy from '../acl_proxy';
import withContext from '../context/with_context';
import { currentUserShape } from '../prop_types';

import AppConstants from '../../constants/application_constants';

import { extractFileExtensionFromUrl } from '../../utils/file_utils';
import { getLangText } from '../../utils/lang_utils';


const EMBED_IFRAME_HEIGHT = {
    video: 315,
    audio: 62
};


let MediaContainer = React.createClass({
    propTypes: {
        content: React.PropTypes.object.isRequired,
        refreshObject: React.PropTypes.func.isRequired,

        // Injected through HOCs
        currentUser: currentUserShape.isRequired // eslint-disable-line react/sort-prop-types
    },

    getInitialState() {
        return {
            timerId: null
        };
    },

    componentDidMount() {
        const { content: { digital_work: digitalWork }, refreshObject } = this.props;
        const { timerId } = this.state;

        if (digitalWork && (this.isVideoEncoding() || this.isImageEncoding()) && !timerId) {
            this.setState({ timerId: window.setInterval(refreshObject, AppConstants.encodeUpdateThreshold) });
        }
    },

    componentWillUpdate() {
        const { timerId } = this.state;

        if (!(this.isVideoEncoding() || this.isImageEncoding()) && timerId) {
            window.clearInterval(timerId);
        }
    },

    componentWillUnmount() {
        window.clearInterval(this.state.timerId);
    },

    isVideoEncoding() {
        const { content: { digital_work: digitalWork } } = this.props;
        return digitalWork.mime === 'video' && typeof digitalWork.isEncoding === 'number' && digitalWork.isEncoding !== 100;
    },

    isImageEncoding() {
        const { content: { thumbnail, digital_work: digitalWork } } = this.props;
        const thumbnailToCheck = thumbnail.thumbnail_sizes && thumbnail.thumbnail_sizes['600x600'] ? thumbnail.thumbnail_sizes['600x600']
                                                                                                   : thumbnail.url;
        const thumbnailFileExtension = extractFileExtensionFromUrl(thumbnailToCheck);

        return digitalWork.mime === 'image' && (thumbnailFileExtension === 'tif' || thumbnailFileExtension === 'tiff');
    },

    getEncodingMessage() {
        if (this.isVideoEncoding()) {
            const { content: { digital_work: digitalWork } } = this.props;

            return (
                <div className="ascribe-detail-header ascribe-media-player">
                    <p>
                        <em>We successfully received your video and it is now being encoded.
                        <br />You can leave this page and check back on the status later.</em>
                    </p>
                    <ProgressBar now={digitalWork.isEncoding}
                        label="%(percent)s%"
                        className="ascribe-progress-bar" />
                </div>
            );
        } else if (this.isImageEncoding()) {
            return (
                <div className="ascribe-media-player encoding-image">
                    <AscribeSpinner color='dark-blue' size='lg' />
                    <em className="text-center">
                        {getLangText('We successfully received your image and it is now being encoded.')}
                        <br />
                        {getLangText('We will be refreshing this page as soon as encoding has finished.')}
                        <br />
                        {getLangText('(You may close this page)')}
                    </em>
                </div>
            );
        }
    },

    render() {
        const { content, currentUser } = this.props;
        const mimetype = content.digital_work.mime;
        // Pieces and editions are joined to the user by a foreign key in the database, so
        // the information in content will be updated if a user updates their username.
        // We also force uniqueness of usernames, so this check is safe to dtermine if the
        // content was registered by the current user.
        const didUserRegisterContent = currentUser.username === content.user_registered;
        const thumbnail = content.thumbnail.thumbnail_sizes && content.thumbnail.thumbnail_sizes['600x600'] ? content.thumbnail.thumbnail_sizes['600x600']
                                                                                                            : content.thumbnail.url_safe;

        let embed = null;
        let extraData = null;

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
                            disabled={this.isVideoEncoding()}>
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
                    thumbnail={thumbnail}
                    url={content.digital_work.url}
                    extraData={extraData}
                    encodingMessage={this.getEncodingMessage()} />
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
                        <S3DownloadButton
                            url={content.digital_work.url}
                            title={content.title}
                            artistName={content.artist_name}
                            fileExtension={extractFileExtensionFromUrl(content.digital_work.url)} />
                    </AclProxy>
                    {embed}
                </p>
            </div>
        );
    }
});

export default withContext(MediaContainer, 'currentUser');
