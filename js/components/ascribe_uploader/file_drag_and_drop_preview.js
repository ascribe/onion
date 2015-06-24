import React from 'react';

import FileDragAndDropPreviewImage from './file_drag_and_drop_preview_image';
import FileDragAndDropPreviewOther from './file_drag_and_drop_preview_other';


let FileDragAndDropPreview = React.createClass({

    propsTypes: {
        file: React.PropTypes.shape({
            url: React.PropTypes.string,
            type: React.PropTypes.string
        }).isRequired,
        handleDeleteFile: React.PropTypes.func
    },

    handleDeleteFile(event) {
        event.preventDefault();
        event.stopPropagation();

        // handleDeleteFile is optional, so if its not submitted,
        // don't run it
        if(this.props.handleDeleteFile) {
            this.props.handleDeleteFile(this.props.file.id);
        }
    },

    render() {
        let previewElement;

        // Decide wether an image or a placeholder picture should be displayed
        if(this.props.file.type.split('/')[0] === 'image') {
            previewElement = (<FileDragAndDropPreviewImage 
                    progress={this.props.file.progress} 
                    url={this.props.file.url}/>);
        } else {
            previewElement = (<FileDragAndDropPreviewOther 
                    progress={this.props.file.progress} 
                    type={this.props.file.type.split('/')[1]}/>);
        }

        return (
            <div 
                className="file-drag-and-drop-position" 
                onClick={this.handleDeleteFile}>
                {previewElement}
            </div>
        );
    }
});

export default FileDragAndDropPreview;