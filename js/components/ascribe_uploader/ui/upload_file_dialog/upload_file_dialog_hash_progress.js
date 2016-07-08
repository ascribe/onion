import React from 'react';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

import UploadFileDialogPrintWrapper from './upload_file_dialog_print_wrapper';

import { getLangText } from '../../../../utils/lang';


const { arrayOf, func, number, shape } = React.PropTypes;

const propTypes = {
    handleCancelHashing: func.isRequired,
    hashingFiles: arrayOf(shape({
        progress: number.isRequired
    })).isRequired
};

const UploadFileDialogHashProgress = ({ handleCancelHashing, hashingFiles }) => {
    const hashingProgress = 100 * hashingFiles
        .reduce((total, { progress }) => total + (progress / hashingFiles.length), 0);

    return (
        <div className="file-drag-and-drop-hashing-dialog">
            <p>
                {getLangText(`Computing ${hashingFiles.length > 1 ? 'hashes' : 'hash'}... ` +
                             'This may take a few minutes.')}
            </p>
            <a onClick={handleCancelHashing} tabIndex={0}>
                {getLangText('Cancel hashing')}
            </a>
            <ProgressBar
                className="ascribe-progress-bar"
                label="%(percent)s%"
                now={Math.ceil(hashingProgress)} />
        </div>
    );
};

UploadFileDialogHashProgress.propTypes = propTypes;

export default UploadFileDialogPrintWrapper(UploadFileDialogHashProgress);
