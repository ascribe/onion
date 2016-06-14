'use strict';

import React from 'react';

import Form from './form';
import Property from './property';
import InputTextAreaToggable from './input_textarea_toggable';

import { getLangText } from '../../utils/lang.js';
import { formatText } from '../../utils/text';
import { resolveUrl } from '../../utils/url_resolver';


let PieceExtraDataForm = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        pieceId: React.PropTypes.number.isRequired,

        convertLinks: React.PropTypes.bool,
        editable: React.PropTypes.bool,
        extraData: React.PropTypes.object,
        handleSuccess: React.PropTypes.func,
        title: React.PropTypes.string
    },

    getFormData() {
        const { name, pieceId } = this.props;

        return {
            extradata: {
                [name]: this.refs.form.refs[name].state.value
            },
            piece_id: pieceId
        };
    },

    getUrl() {
        return formatText(resolveUrl('piece_extradata'), {
            pieceId: this.props.pieceId
        });
    },

    render() {
        const { convertLinks, editable, extraData, handleSuccess, name, title } = this.props;
        const defaultValue = (extraData && extraData[name]) || null;

        if (!defaultValue && !editable) {
            return null;
        }

        return (
            <Form
                ref='form'
                disabled={!editable}
                getFormData={this.getFormData}
                handleSuccess={handleSuccess}
                url={this.getUrl()}>
                <Property
                    name={name}
                    label={title}>
                    <InputTextAreaToggable
                        rows={1}
                        convertLinks={convertLinks}
                        defaultValue={defaultValue}
                        placeholder={getLangText('Fill in%s', ' ') + title}
                        required />
                </Property>
                <hr />
            </Form>
        );
    }
});


export default PieceExtraDataForm;
