import React from 'react';
import classNames from 'classnames';

import { pausedFilesFilter, uploadedFilesFilter, uploadingFilesFilter } from 'react-utility-belt/es6/uploader/utils/file_filters';

import UploadFilePreviewImage from './upload_file_preview_image';
import UploadFilePreviewOther from './upload_file_preview_other';

import UploadProgressBar from '../upload_progress_bar';

import { extractFileExtensionFromString } from '../../../../utils/file';
import { getLangText } from '../../../../utils/lang';
import { truncateText } from '../../../../utils/text';


const { bool, func, shape, string } = React.PropTypes;

const UploadFileName = ({ file: { name } }) => (
    <span className="upload-file-preview--label">
        {truncateText(name, 30, `(...).${extractFileExtensionFromString(name)}`)}
    </span>
);

UploadFileName.propTypes = {
    file: shape({
        name: string.isRequired
    }).isRequired
};

const UploadRemoveButton = ({ handleRemoveFile }) => (
    <button className="remove-file-btn text-center" onClick={handleRemoveFile}>
        <span
            aria-hidden
            className="glyphicon glyphicon-remove"
            title={getLangText('Remove file')} />
    </button>
);

UploadRemoveButton.propTypes = {
    handleRemoveFile: func.isRequired
};


const UploadFilePreview = React.createClass({
    propTypes: {
        file: shape({
            name: string.isRequired,
            type: string.isRequired
        }).isRequired,
        handleCancelFile: func.isRequired,
        handleDeleteFile: func.isRequired,
        handlePauseFile: func.isRequired,
        handleResumeFile: func.isRequired,

        className: string,
        downloadable: bool,
        pausable: bool,
        removable: bool,
        showName: bool,
        showProgress: bool,
        thumbnailUrl: string
    },

    handleRemoveFile() {
        const { file, handleCancelFile, handleDeleteFile } = this.props;

        // We only want to delete when we're sure that the file has been *completely* uploaded to S3
        // and can now be properly deleted using an HTTP DELETE request.
        if (uploadedFilesFilter(file) && file.s3UrlSafe) {
            handleDeleteFile(file);
        } else {
            handleCancelFile(file);
        }
    },

    toggleUploadProcess() {
        const { file, handlePauseFile, handleResumeFile } = this.props;

        if (uploadingFilesFilter(file)) {
            handlePauseFile(file.id);
        } else if (pausedFilesFilter(file)) {
            handleResumeFile(file.id);
        } else {
            console.logGlobal(
                new Error('Tried to pause / resume upload of file that was not in a paused or ' +
                          'uploading state'),
                { file }
            );
        }
    },

    render() {
        const {
            className,
            downloadable,
            file,
            pausable,
            removable,
            showName,
            showProgress,
            thumbnailUrl
        } = this.props;

        const previewProps = {
            downloadable,
            file,
            pausable,
            toggleUploadProcess: this.toggleUploadProcess
        };

        // Decide whether an image or a placeholder thumbnail should be displayed
        // Even if a file is not an image, we'll display it as an image if it has has a thumbnail
        const previewElement = (thumbnailUrl || file.type.split('/')[0] === 'image')
            ? (<UploadFilePreviewImage {...previewProps} thumbnailUrl={thumbnailUrl || file.url} />)
            : (<UploadFilePreviewOther {...previewProps} />);

        const fileProgressBar = showProgress ? (
            <UploadProgressBar className="ascribe-progress-bar-xs" files={[file]} />
        ) : null;

        const fileRemoveButton = removable ? (
            <UploadRemoveButton handleRemoveFile={this.handleRemoveFile} />
        ) : null;

        const fileName = showName ? (<UploadFileName file={file} />) : null;

        return (
            <div className={classNames(className, 'upload-file-preview-container')}>
                <div className="upload-file-preview">
                    {fileProgressBar}
                    {previewElement}
                    {fileRemoveButton}
                </div>
                {fileName}
            </div>
        );
    }
});

export default UploadFilePreview;
