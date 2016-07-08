import React from 'react';
import classNames from 'classnames';

import Uploadify from 'react-utility-belt/es6/uploader/uploadify';
import { UploadButtonBase } from 'react-utility-belt/es6/uploader/upload_button';
import { uploadedFilesFilter, uploadingFilesFilter } from 'react-utility-belt/es6/uploader/utils/file_filters';
import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';

import Uploader from '../uploader';

import { safeInvoke } from '../../../utils/general';
import { getLangText } from '../../../utils/lang';
import { truncateText } from '../../../utils/text';


const { arrayOf, func, object, shape, string } = React.PropTypes;

const FileLabel = ({ files, handleRemoveFiles }) => {
    let label;

    if (files.length) {
        const uploadedFiles = files.filter(uploadedFilesFilter);
        const uploadingFiles = files.filter(uploadingFilesFilter);

        const uploadedIcon = uploadedFiles.length && !uploadingFiles.length
            ? (<span className="ascribe-icon icon-ascribe-ok uploader-button--label-icon" />)
            : null;

        const labelText = files.length > 1 ? `${files.length} ${getLangText('files')}`
                                           : truncateText(files[0].name, 40);

        const removeActionText = getLangText(
            uploadingFiles.length ? `cancel ${files.length > 1 ? 'uploads' : 'upload'}`
                                  : 'remove'
        );

        label = [
            uploadedIcon,
            labelText,
            ' [',
            (<a key="remove-link" onClick={handleRemoveFiles} tabIndex={0}>{removeActionText}</a>),
            ']'
        ];
    } else {
        label = getLangText('No file selected');
    }

    return (<span className="upload-button--label">{label}</span>);
};

FileLabel.propTypes = {
    files: arrayOf(shape({
        name: string.isRequired
    })).isRequired,

    handleRemoveFiles: func.isRequired
};


const UploadButton = ({ className, ...props }) => (
    <UploadButtonBase {...props} className={classNames(className, 'upload-button')} />
);

UploadButton.propTypes = {
    className: string
};

UploadButton.defaultProps = {
    buttonType: 'button',
    getUploadingButtonLabel: (uploaderFiles, progress) => (
        `${getLangText('Upload progress')}: ${progress}%`
    ),
    fileLabelType: FileLabel
};


/**
 * We want to add some additional default uploader functionality on top of the UI defaults we've
 * added to the base upload button, so we wrap another class around the Uploadified instance of our
 * UploadButton and export that as our default export.
 */
const UploadifiedUploadButton = Uploadify(UploadButton);
const UploadButtonUploadifyWrapper = React.createClass(uploaderSpecExtender({
    displayName: 'UploadbuttonUploadifyWrapper',

    propTypes: {
        uploaderProps: object,
        uploaderType: func
    },

    getDefaultProps() {
        return {
            uploaderType: Uploader
        };
    },

    onError(file, ...args) {
        // Automatically cancel any files that fail.
        this.refs.uploader.handleCancelFile(file);

        safeInvoke(this.props.uploaderProps.onError, file, ...args);
    },

    render() {
        const { uploaderProps, ...restProps } = this.props;
        const props = {
            ...restProps,

            uploaderProps: {
                ...uploaderProps,
                onError: this.onError
            }
        };

        return (
            <UploadifiedUploadButton ref="uploader" {...props} />
        );
    }
}));

export default UploadButtonUploadifyWrapper;

// Also export the non-uploadify version for extension
export {
    UploadButton as UploadButtonBase
};
