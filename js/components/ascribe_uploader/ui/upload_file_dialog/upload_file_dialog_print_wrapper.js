import React from 'react';

import { getLangText } from '../../../../utils/lang';


/**
 * Wrapper component to hide the given upload file dialog component from being printed, instead
 * replacing it with a message saying that there's nothing uploaded yet. Useful for UI components
 * that are used to show a pre-upload state of the upload file dialog.
 */
const UploadFileDialogPrintWrapper = (Component) => (
    (props) => (
        <div>
            <div className="hidden-print">
                <Component {...props} />
            </div>
            <p className="text-align-center visible-print">
                {getLangText('No files uploaded')}
            </p>
        </div>
    )
);

export default UploadFileDialogPrintWrapper;
