'use strict';

import React from 'react';


/*
    Is this even used somewhere?
    Deprecate? 5.6.15 - Tim

 */
let ButtonSubmitOrClose = React.createClass({
    render() {
        if (this.props.submitted){
            return (
                <div className="modal-footer">
                    <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                </div>
            )
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
