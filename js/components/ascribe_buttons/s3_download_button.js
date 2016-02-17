'use strict';

import React from 'react';

import S3Fetcher from '../../fetchers/s3_fetcher';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang_utils';
import { queryParamsToArgs } from '../../utils/url_utils';


const { string } = React.PropTypes;

const S3DownloadButton = React.createClass({
    propTypes: {
        url: string,
        title: string,
        artistName: string,
        fileExtension: string
    },

    getInitialState() {
        return {
            downloadUrl: null
        };
    },

    componentDidMount() {
        /**
         * Initially, we request a signed url from
         * the backend
         */
        this.signUrl();
    },

    transformS3UrlToS3Key(url) {
        return url.replace(`https://${AppConstants.cloudfrontDomain}/`, '');
    },

    signUrl(next) {
        const { url, title, artistName } = this.props;

        S3Fetcher
            .signUrl(this.transformS3UrlToS3Key(url), title, artistName)
            .then(({ signed_url: downloadUrl }) => this.setState({ downloadUrl }, next))
            .catch(console.logGlobal);
    },

    reSignUrl(event) {
        /**
         * The signed url, however can expire, which is why
         * we need to renew it when it expires.
         */
        const { downloadUrl } = this.state;
        const { expires } = queryParamsToArgs(downloadUrl.split('?')[1]);
        const nowInSeconds = new Date().getTime() / 1000;

        if(nowInSeconds > expires) {
            event.preventDefault();
            this.signUrl(() => this.refs.downloadButton.getDOMNode().click());
        }
    },

    render() {
        const { fileExtension, url } = this.props;
        const { downloadUrl } = this.state;

        return (
            <span>
                <a
                    ref="downloadButton"
                    download
                    className="btn btn-xs btn-default ascribe-margin-1px"
                    target="_blank"
                    onClick={this.reSignUrl}
                    href={downloadUrl || url}>
                    {/*
                        If it turns out that `fileExtension` is an empty string, we're just
                        using the label 'file'.
                    */}
                    {getLangText('Download')} .{fileExtension || 'file'} <Glyphicon glyph="cloud-download" />
                </a>
            </span>
        );
    }
});

export default S3DownloadButton;