import React from 'react';
import InjectInHeadMixin from '../../mixins/inject_in_head_mixin';

/**
 * This is the component that implements display-specific functionality.
 *
 * ResourceViewer handles the following mimetypes:
 *  - image
 *  - video
 *  - audio
 *  - pdf
 *  - other
 */

let resourceMap = {
    'image': 1
}

let ResourceViewer = React.createClass({
    propTypes: {
        thumbnail: React.PropTypes.string.isRequired,
        mimetype: React.PropTypes.oneOf(['image', 'video', 'audio', 'pdf', 'other']).isRequired
    },

    mixins: [InjectInHeadMixin],

    componentDidMount() {
    },

    render() {
        return (
            <div>
                resourceviewer {this.props.thumbnail} {this.props.mimetype}
            </div>
        );
    }
});

export default ResourceViewer;
