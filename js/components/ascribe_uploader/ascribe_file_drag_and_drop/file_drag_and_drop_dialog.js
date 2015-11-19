'use strict';

import React from 'react';
import { Link } from 'react-router';

import { dragAndDropAvailable } from '../../../utils/feature_detection_utils';
import { getLangText } from '../../../utils/lang_utils';
import { getCurrentQueryParams } from '../../../utils/url_utils';

let FileDragAndDropDialog = React.createClass({
    propTypes: {
        hasFiles: React.PropTypes.bool,
        multipleFiles: React.PropTypes.bool,
        enableLocalHashing: React.PropTypes.bool,
        uploadMethod: React.PropTypes.string,
        onClick: React.PropTypes.func,

        // A class of a file the user has to upload
        // Needs to be defined both in singular as well as in plural
        fileClassToUpload: React.PropTypes.shape({
            singular: React.PropTypes.string,
            plural: React.PropTypes.string
        })
    },

    getDragDialog(fileClass) {
        if (dragAndDropAvailable) {
            return [
                <p>{getLangText('Drag %s here', fileClass)}</p>,
                <p>{getLangText('or')}</p>
            ];
        } else {
            return null;
        }
    },

    render() {
        const {
            hasFiles,
            multipleFiles,
            enableLocalHashing,
            uploadMethod,
            fileClassToUpload,
            onClick } = this.props;

        if (hasFiles) {
            return null;
        } else {
            const dialog = uploadMethod === 'hash' ? getLangText('choose a %s to hash', fileClassToUpload.singular)
                                                   : getLangText('choose a %s to upload', fileClassToUpload.singular);

            return (
                <span className="file-drag-and-drop-dialog">
                    {this.getDragDialog(fileClassToUpload.singular)}
                    <span
                        className="btn btn-default"
                        onClick={onClick}>
                            {dialog}
                    </span>
                </span>
            );
        }
    }
});

export default FileDragAndDropDialog;
