'use strict';

import React from 'react';

import Form from '../ascribe_forms/form';
import Property from '../ascribe_forms/property';

import apiUrls from '../../constants/api_urls';

import { getLangText } from '../../utils/lang_utils';

let CreateEditionsForm = React.createClass({

    propTypes: {
        handleSuccess: React.PropTypes.func,
        pieceId: React.PropTypes.number
    },

    getFormData(){
        return {
            piece_id: parseInt(this.props.pieceId, 10)
        };
    },

    render() {
        return (
            <Form
                ref='form'
                url={apiUrls.editions}
                getFormData={this.getFormData}
                handleSuccess={this.props.handleSuccess}
                spinner={
                    <button className="btn ascribe-btn ascribe-btn-login ascribe-btn-login-spinner">
                        <img src="https://s3-us-west-2.amazonaws.com/ascribe0/media/thumbnails/ascribe_animated_medium.gif" />
                    </button>
                    }>
                <Property
                    name='num_editions'
                    label={getLangText('Number of editions')}>
                    <input
                        type="number"
                        placeholder="(e.g. 32)"
                        min={0}/>
                </Property>
            </Form>
        );
    }
});

export default CreateEditionsForm;