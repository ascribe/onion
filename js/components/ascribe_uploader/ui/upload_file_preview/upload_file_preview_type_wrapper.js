import React from 'react';

import { pausedFilesFilter, uploadedFilesFilter, uploadingFilesFilter } from 'react-utility-belt/es6/uploader/utils/file_filters';

import AscribeSpinner from '../../../ascribe_spinner';

import { getLangText } from '../../../../utils/lang';


const { bool, func, shape, string } = React.PropTypes;

/**
 * Wrapper component for preview types that handles upload states and pause / resume functionality
 */
const displayName = 'UploadFilePreviewTypeWrapper';
const propTypes = {
    file: shape({
        s3UrlSafe: string.isRequired
    }).isRequired,

    // Allow the file to be downloaded
    downloadable: bool,

    // Enable upload pause / resume functionality
    pausable: bool,

    // Controls pausing / resuming the file if pause / resume functionality is enabled
    toggleUploadProcess: func

    // All props are passed through to the PreviewComponent as well
};

const UploadFilePreviewTypeWrapper = (PreviewComponent) => {
    const wrapperComponent = (props) => {
        const { downloadable, file, pausable, toggleUploadProcess } = props;
        const { s3UrlSafe } = file;
        let uploadStateSymbol;

        if (uploadedFilesFilter(file)) {
            // Uploaded
            uploadStateSymbol = downloadable ? (
                <a
                    aria-hidden
                    className="glyphicon glyphicon-download action-file"
                    href={s3UrlSafe}
                    target="_blank"
                    title={getLangText('Download file')} />
            ) : (
                <span className='ascribe-icon icon-ascribe-ok action-file' />
            );
        } else if (uploadingFilesFilter(file)) {
            // Uploading
            uploadStateSymbol = pausable ? (
                <span
                    aria-hidden
                    className="glyphicon glyphicon-pause action-file"
                    onClick={toggleUploadProcess}
                    title={getLangText('Pause upload')} />
            ) : (
                <AscribeSpinner className="spinner-file" color='dark-blue' size='md' />
            );
        } else if (pausedFilesFilter(file)) {
            // Paused
            if (pausable) {
                uploadStateSymbol = (
                    <span
                        aria-hidden
                        className="glyphicon glyphicon-play action-file"
                        onClick={toggleUploadProcess}
                        title={getLangText('Resume uploading')} />
                );
            } else {
                console.logGlobal(
                    new Error('UploadFilePreview encountered paused file but did not have resume ' +
                              'functionality enabled'),
                    { file }
                );
            }
        } else {
            console.logGlobal(
                new Error('UploadFilePreview encountered file that was not uploading, uploaded, ' +
                          'or paused'),
                { file }
            );
        }

        return (
            <PreviewComponent {...props} file={file}>
                {uploadStateSymbol}
            </PreviewComponent>
        );
    };

    wrapperComponent.displayName = displayName;
    wrapperComponent.propTypes = propTypes;

    return wrapperComponent;
};

export default UploadFilePreviewTypeWrapper;
