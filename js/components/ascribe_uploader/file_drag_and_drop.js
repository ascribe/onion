import React from 'react';
import FileDragAndDropPreviewIterator from './file_drag_and_drop_preview_iterator';


// Taken from: https://github.com/fedosejev/react-file-drag-and-drop
var FileDragAndDrop = React.createClass({
    propTypes: {
        onDragStart: React.PropTypes.func,
        onDrop: React.PropTypes.func.isRequired,
        onDragEnter: React.PropTypes.func,
        onLeave: React.PropTypes.func,
        onDragOver: React.PropTypes.func,
        onDragEnd: React.PropTypes.func,
        filesToUpload: React.PropTypes.array,
        handleDeleteFile: React.PropTypes.func
    },

    handleDragStart(event) {
        if (typeof this.props.onDragStart === 'function') {
            this.props.onDragStart(event);
        }
    },

    handleDrag(event) {
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event);
        }
    },

    handleDragEnd(event) {
        if (typeof this.props.onDragEnd === 'function') {
          this.props.onDragEnd(event);
        }
    },

    handleDragEnter(event) {
        if (typeof this.props.onDragEnter === 'function') {
            this.props.onDragEnter(event);
        }
    },

    handleDragLeave(event) {
        if (typeof this.props.onDragLeave === 'function') {
            this.props.onDragLeave(event);
        }
    },

    handleDragOver(event) {
        event.preventDefault();

        if (typeof this.props.onDragOver === 'function') {
            this.props.onDragOver(event);
        }
    },


    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        let files;

        // handle Drag and Drop
        if(event.dataTransfer && event.dataTransfer.files.length > 0) {
            files = event.dataTransfer.files;
        } else if(event.target.files) { // handle input type file
            files = event.target.files;
        }

        if(typeof this.props.onDrop === 'function' && files) {
          this.props.onDrop(files);
        }

    },

    handleDeleteFile(fileId) {
        // input's value is not change the second time someone
        // inputs the same file again, therefore we need to reset its value
        this.refs.fileinput.getDOMNode().value = '';
        this.props.handleDeleteFile(fileId);
    },

    handleOnClick() {
        // Simulate click on hidden file input
        var event = document.createEvent('HTMLEvents');
        event.initEvent('click', false, true);
        this.refs.fileinput.getDOMNode().dispatchEvent(event);
    },

    render: function () {
        let hasFiles = this.props.filesToUpload.length > 0;

        return (
            <div
                className={hasFiles ? 'file-drag-and-drop has-files' : 'file-drag-and-drop' }
                onClick={this.handleOnClick}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrop}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragEnd={this.handleDragEnd}>
                    {hasFiles ? null : <span>Click or drag to add files</span>}
                    <FileDragAndDropPreviewIterator
                        files={this.props.filesToUpload}
                        handleDeleteFile={this.handleDeleteFile}/>
                    <input
                        multiple
                        ref="fileinput"
                        type="file"
                        style={{
                            display: 'none',
                            height: 0,
                            width: 0
                        }}
                        onChange={this.handleDrop} />
            </div>
      );
    }
});

module.exports = FileDragAndDrop;