'use strict';

import React from 'react';

import Form from '../../../../../ascribe_forms/form';
import Property from '../../../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../../../ascribe_forms/input_textarea_toggable';

import { getLangText } from '../../../../../../utils/lang_utils';


const PRRegisterPieceForm = React.createClass({
    getInitialState(){
        return {
            isUploadReady: false
        };
    },

    handleSuccess() {

    },

    render() {
        return (
            <div>
                <Form
                    className="ascribe-form-bordered"
                    ref="registerPieceFields">
                    <Property
                        name='artist_name'
                        label={getLangText('Full name')}>
                        <input
                            type="text"
                            placeholder="(e.g. Andy Warhol)"
                            required/>
                    </Property>
                    <Property
                        name='title'
                        label={getLangText('Title of the Work')}>
                        <input
                            type="text"
                            placeholder="(e.g. 32 Campbell's Soup Cans)"
                            required/>
                    </Property>
                    <Property
                        name='date_created'
                        label={getLangText('Year of creation')}>
                        <input
                            type="number"
                            placeholder="(e.g. 1962)"
                            min={1}
                            required/>
                    </Property>
                </Form>
                <Form
                    className="ascribe-form-bordered"
                    ref="additionalData">
                    <Property
                        name='biography'
                        label={getLangText('Biography')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                    <Property
                        name='artist_statement'
                        label={getLangText("Artist's statement")}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                    <Property
                        name='exhibition'
                        label={getLangText('Exhibition / Publication history (optional)')}>
                        <InputTextAreaToggable
                            rows={1}
                            placeholder={getLangText('THIS NEEDS TEXT')}/>
                    </Property>
                </Form>
            </div>
        );
    }
});

export default PRRegisterPieceForm;