import React from 'react';

/**
 * This is the component that implements display-specific functionality
 */
let ImageViewer = React.createClass({
    propTypes: {
        thumbnail: React.PropTypes.string.isRequired
    },

    render() {
        let thumbnail = <img className="img-responsive" src={this.props.thumbnail}/>;
        let aligner = <span className="vcenter"></span>;
        return (
            <div>
                <div>
                {aligner}
                {thumbnail}
                </div>
            </div>
        );
    }
});

export default ImageViewer;