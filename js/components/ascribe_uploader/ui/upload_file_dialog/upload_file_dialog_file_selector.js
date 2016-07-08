import React from 'react';

import { dragAndDropAvailable } from 'js-utility-belt/es6/feature_detection';

import UploadFileDialogPrintWrapper from './upload_file_dialog_print_wrapper';

import { UploadMethods } from '../../../../constants/uploader_constants';

import { getLangText } from '../../../../utils/lang';


const { bool, func, oneOf, shape, string } = React.PropTypes;

const propTypes = {
    fileTypeNames: shape({
        plural: string.isRequired,
        singular: string.isRequired
    }).isRequired,
    uploadMethod: oneOf([
        UploadMethods.HASH,
        UploadMethods.NORMAL,
        UploadMethods.USE_URL_PARAM
    ]).isRequired,

    handleSelectFiles: func,
    multiple: bool
};

const getDragDialog = (fileTypeName) => {
    if (dragAndDropAvailable) {
        return [
            <p key="upload-drag-title" className="file-drag-and-drop-dialog-title">
                {getLangText('Drag %s here', fileTypeName)}
            </p>,
            <p key="upload-drag-subtitle">{getLangText('or')}</p>
        ];
    } else {
        return null;
    }
};

const UploadFileDialogFileSelector = ({ fileTypeNames, handleSelectFiles, multiple, uploadMethod }) => {
    const uploadMethodName = uploadMethod === UploadMethods.HASH ? 'hash' : 'upload';

    if (uploadMethod !== UploadMethods.HASH || uploadMethod !== UploadMethods.NORMAL) {
        console.logGlobal(
            new Error('Unsupported upload method given to UploadFileSelector'),
            { uploadMethod }
        );
    }

    const buttonMsg = multiple
        ? getLangText(`choose %s to ${uploadMethodName}`, fileTypeNames.plural)
        : getLangText(`choose a %s to ${uploadMethodName}`, fileTypeNames.singular);

    return (
        <div className="file-drag-and-drop-dialog">
            {getDragDialog(multiple ? fileTypeNames.plural : fileTypeNames.singular)}
            <button
                className="btn btn-default"
                onClick={handleSelectFiles}>
                {buttonMsg}
            </button>
        </div>
    );
};

UploadFileDialogFileSelector.propTypes = propTypes;

export default UploadFileDialogPrintWrapper(UploadFileDialogFileSelector);
