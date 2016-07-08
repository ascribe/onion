import React from 'react';
import Link from 'react-router/es6/Link';

import UploadFileDialogPrintWrapper from './upload_file_dialog_print_wrapper';

import withContext from '../../../context/with_context';

import { locationShape } from '../../../prop_types';

import { UploadMethods } from '../../../../constants/uploader_constants';

import { getLangText } from '../../../../utils/lang';
import { getCurrentQueryParams } from '../../../../utils/url';


const propTypes = {
    location: locationShape.isRequired
};

const UploadFileDialogMethodSelector = ({ location }) => {
    const currentQueryParams = getCurrentQueryParams();
    const queryParamsHash = Object.assign({}, currentQueryParams, {
        uploadMethod: UploadMethods.HASH
    });
    const queryParamsNormal = Object.assign({}, currentQueryParams, {
        uploadMethod: UploadMethods.NORMAL
    });

    return (
        <div className="file-drag-and-drop-dialog">
            <div className="present-options">
                <p className="file-drag-and-drop-dialog-title">
                    {getLangText('Would you rather')}
                </p>
                <Link query={queryParamsHash} to={location.pathname}>
                    <button className="btn btn-default btn-sm">
                        {getLangText('Hash your work')}
                    </button>
                </Link>
                <span>{getLangText('or')}</span>
                <Link query={queryParamsNormal} to={location.pathname}>
                    <button className="btn btn-default btn-sm">
                        {getLangText('Upload and hash your work')}
                    </button>
                </Link>
            </div>
        </div>
    );
};

UploadFileDialogMethodSelector.propTypes = propTypes;

export default UploadFileDialogPrintWrapper(withContext(UploadFileDialogMethodSelector, 'location'));
