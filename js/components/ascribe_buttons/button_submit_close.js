'use strict';

import React from 'react';

let ButtonSubmitOrClose = React.createClass({
    propTypes: {
        submitted: React.PropTypes.bool.isRequired,
        text: React.PropTypes.string.isRequired,
        onClose: React.PropTypes.func.isRequired
    },

    render() {
        if (this.props.submitted){
            return (
                <div className="modal-footer">
                    <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                </div>
            );
        }
        return (
            <div className="modal-footer">
                <button type="submit" className="btn btn-ascribe-inv">{this.props.text}</button>
                <button className="btn btn-ascribe-inv" onClick={this.props.onClose}>CLOSE</button>
            </div>
        );
    }
});

export default ButtonSubmitOrClose;
