'use strict';

import React from 'react';

import AppConstants from '../../constants/application_constants';
import { getLangText } from '../../utils/lang_utils.js'

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
                    <img src={AppConstants.baseUrl + 'static/img/ascribe_animated_medium.gif'} />
                </div>
            );
        }
        return (
            <div className="modal-footer">
                <button type="submit" className="btn btn-ascribe-inv">{this.props.text}</button>
                <button className="btn btn-ascribe-inv" onClick={this.props.onClose}>{getLangText('CLOSE')}</button>
            </div>
        );
    }
});

export default ButtonSubmitOrClose;
