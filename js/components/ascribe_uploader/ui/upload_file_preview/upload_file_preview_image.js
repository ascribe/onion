import React from 'react';

import UploadFilePreviewTypeWrapper from './upload_file_preview_type_wrapper';


const { node, string } = React.PropTypes;

const propTypes = {
    thumbnailUrl: string.isRequired,

    children: node
};

const UploadFilePreviewImage = ({ children, thumbnailUrl }) => {
    const imageStyle = {
        backgroundImage: `url("${thumbnailUrl}")`,
        backgroundSize: 'cover'
    };

    return (
        <div className="file-drag-and-drop-preview-image hidden-print" style={imageStyle}>
            {children}
        </div>
    );
};

UploadFilePreviewImage.propTypes = propTypes;

export default UploadFilePreviewTypeWrapper(UploadFilePreviewImage);
