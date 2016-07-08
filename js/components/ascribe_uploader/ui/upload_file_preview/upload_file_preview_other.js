import React from 'react';

import UploadFilePreviewTypeWrapper from './upload_file_preview_type_wrapper';

import { extractFileExtensionFromString } from '../../../../utils/file';


const { bool, node, shape, string } = React.PropTypes;

const propTypes = {
    file: shape({
        name: string.isRequired
    }).isRequired,

    children: node,
    showType: bool
};

const UploadFilePreviewOther = ({ children, showType, file: { name } }) => (
    <div className="file-drag-and-drop-preview-other">
        {children}
        {showType ? (
            <p className="file-drag-and-drop-preview-other--label">
                {`.${extractFileExtensionFromString(name) || 'file'}`}
            </p>
        ) : null}
    </div>
);

UploadFilePreviewOther.propTypes = propTypes;

export default UploadFilePreviewTypeWrapper(UploadFilePreviewOther);
