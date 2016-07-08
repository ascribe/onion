import React from 'react';
import classNames from 'classnames';

import { ErrorClasses } from '../../../../constants/error_constants';

import { getLangText } from '../../../../utils/lang';


const { arrayOf, bool, func, node, number, object, shape, string } = React.PropTypes;

/** HELPER COMPONENTS **/
// Retry button
const UploadErrorRetryButton = ({ children, handleRetryFiles, openIntercom }) => (
    <button
        className='btn btn-default'
        onClick={() => {
            if (openIntercom) {
                window.Intercom('showNewMessage', getLangText("I'm having trouble uploading my file."));
            }

            handleRetryFiles();
        }}
        type="button">
        {children}
    </button>
);

UploadErrorRetryButton.propTypes = {
    handleRetryFiles: func.isRequired,

    children: node,
    openIntercom: bool
};

// Contact us dialog
const UploadErrorContactUs = ({ handleRetryFiles }) => (
    <div className='file-drag-and-drop-error'>
        <h4>{getLangText('Let us help you')}</h4>
        <p>{getLangText('Still having problems? Send us a message.')}</p>
        <UploadErrorRetryButton openIntercom handleRetryFiles={handleRetryFiles}>
            {getLangText('Contact us')}
        </UploadErrorRetryButton>
    </div>
);

UploadErrorContactUs.propTypes = {
    handleRetryFiles: func.isRequired
};

// Error details dialog
const UploadErrorDetails = ({ errorClass: { prettifiedText }, failedFiles, handleRetryFiles }) => (
    <div className='file-drag-and-drop-error'>
        <div
            className={classNames(
                'file-drag-and-drop-error-detail', {
                    'file-drag-and-drop-error-detail-multiple-files': failedFiles.length
                }
            )}>
            <h4>{getLangText(failedFiles.length ? 'Some files did not upload correctly'
                                                : 'Error uploading the file!')}
            </h4>
            <p>{prettifiedText}</p>
            <UploadErrorRetryButton handleRetryFiles={handleRetryFiles}>
                {getLangText('Retry')}
            </UploadErrorRetryButton>
        </div>
        <span
            className={classNames(
                'file-drag-and-drop-error-icon-container', {
                    'file-drag-and-drop-error-icon-container-multiple-files': failedFiles.length
                }
            )}>
            <span className='ascribe-icon icon-ascribe-thin-cross'></span>
        </span>
        <div className='file-drag-and-drop-error-file-names'>
            <ul>
                {failedFiles.map(({ id, originalName }) => (
                    <li key={id} className='file-name'>{originalName}</li>
                ))}
            </ul>
        </div>
    </div>
);

UploadErrorDetails.propTypes = {
    errorClass: shape({
        prettifiedText: string.isRequired
    }).isRequired,
    failedFiles: arrayOf(shape({
        id: number.isRequired,
        originalName: string.isRequired
    })).isRequired,
    handleRetryFiles: func.isRequired
};


/** CONTAINER COMPONENT **/
// Displays an error detail dialog or a contact us dialog depending on the type of upload error
// encountered.
const UploadFileDialogErrorHandler = ({ errorClass, failedFiles, handleRetryFile, ...props }) => {
    // Just go through and retry all the files if the user wants to retry
    const handleRetryFiles = () => {
        failedFiles.forEach(handleRetryFile);
    };

    const dialogProps = {
        ...props,
        errorClass,
        failedFiles,
        handleRetryFiles
    };

    return errorClass.name === ErrorClasses.upload.contactUs.name
        ? (<UploadErrorContactUs {...dialogProps} />)
        : (<UploadErrorDetails {...dialogProps} />);
};

UploadFileDialogErrorHandler.propTypes = {
    errorClass: shape({
        name: string
    }).isRequired,
    failedFiles: arrayOf(object).isRequired,
    handleRetryFile: func.isRequired
};

export default UploadFileDialogErrorHandler;
