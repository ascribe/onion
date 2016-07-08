import React from 'react';

import UploadFilePreview from '../upload_file_preview';


const { arrayOf, func, object } = React.PropTypes;

const propTypes = {
    files: arrayOf(object).isRequired,

    // Mapping of file ids to thumbnail urls for the file previews.
    // If the file already has a `thumbnailUrl` property, prefer that over checking this mapping.
    thumbnailMapping: object,

    // Props used by UploadFilePreview
    handleCancelFile: func.isRequired,
    handleDeleteFile: func.isRequired,
    handlePauseFile: func.isRequired,
    handleResumeFile: func.isRequired,

    // All other props are passed down to UploadFilePreviews, including:
    //   * downloadable: enable files to be downloaded
    //   * pausable: enable pause / resume functionality
    //   * removable: enable files to be removed
};

const UploadFileDialogPreviewIterator = ({ files, thumbnailMapping, ...props }) => {
    if (files.length) {
        const multipleFiles = files.length > 1;

        return (
            <div>
                {files.map((file, i) => {
                    // Try to use an id from the file, but if we can't find one, just use its array
                    // index.
                    const key = file.uuid || file.id || i;

                    const thumbnailUrl = file.thumbnailUrl ||
                        (thumbnailMapping && 'id' in file ? thumbnailMapping[file.id] : null);

                    return (
                        <UploadFilePreview
                            key={key}
                            {...props}
                            file={file}
                            showName={!multipleFiles}
                            showProgress={multipleFiles}
                            thumbnailUrl={thumbnailUrl} />
                    );
                })}
            </div>
        );
    } else {
        return null;
    }
};

UploadFileDialogPreviewIterator.propTypes = propTypes;

export default UploadFileDialogPreviewIterator;
