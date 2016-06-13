'use strict';

import React from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import S3Fetcher from '../../fetchers/s3_fetcher';

import AppConstants from '../../constants/application_constants';

import { getLangText } from '../../utils/lang';
import { parseQueryParamStr } from '../../utils/url';


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
            downloadUrl: null,
            signatureExpiryTimerId: null
        };
    },

    componentDidMount() {
        // Initially, we request a signed url from the backend
        this.signUrl();
    },

    componentWillUnmount() {
        window.clearTimeout(this.state.signatureExpiryTimerId);
    },

    transformS3UrlToS3Key(url) {
        return url.replace(`https://${AppConstants.cloudfrontDomain}/`, '');
    },

    signUrl() {
        const { url, title, artistName } = this.props;

        S3Fetcher
            .signUrl(this.transformS3UrlToS3Key(url), title, artistName)
            .then(({ signed_url: downloadUrl }) => {
                const { signatureExpiryTimerId } = this.state;

                // The signed url, however can expire, which is why we need to set up a timer to
                // renew it when it expires.
                const expires = parseInt(parseQueryParamStr(downloadUrl).expires, 10);
                const now = new Date().getTime() / 1000;

                // Amazon uses seconds as their signature unix timestamp while `setTimeout` uses
                // milliseconds. Therefore we need to multiply with 1000.
                const interval = (expires - now) * 1000;

                // Make sure to clear the previous timeout just in case it was not the one that
                // invoked the refetching
                if (signatureExpiryTimerId) {
                    window.clearTimeout(signatureExpiryTimerId);
                }

                this.setState({
                    downloadUrl,
                    // Substract 5s to make sure there is a big enough window to sign again before
                    // expiration
                    signatureExpiryTimerId: window.setTimeout(this.signUrl, interval - 5000)
                });
            })
            .catch(console.logGlobal);
    },

    render() {
        const { fileExtension, url } = this.props;
        const { downloadUrl } = this.state;

        return (
            <a
                ref="downloadButton"
                download
                className="btn btn-xs btn-default ascribe-margin-1px"
                target="_blank"
                href={downloadUrl || url}>
                {/*
                    If it turns out that `fileExtension` is an empty string, we're just
                    using the label 'file'.
                */}
                {getLangText('Download')} .{fileExtension || 'file'} <Glyphicon glyph="cloud-download" />
            </a>
        );
    }
});

export default S3DownloadButton;
