'use strict';

import React from 'react';
import RegisterPiece from '../../../register_piece';
import Property from '../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../ascribe_forms/input_textarea_toggable';
import InputCheckbox from '../../../ascribe_forms/input_checkbox';

import { getLangText } from '../../../../utils/lang_utils';


let PrizeRegisterPiece = React.createClass({
    render() {
        return (
            <RegisterPiece
                headerMessage={getLangText('Submit to the prize')}
                submitMessage={getLangText('Submit')}
                canSpecifyEditions={false} >
                <Property
                    name='artist_statement'
                    label={getLangText('Artist statement')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('Enter your statement')}
                        required="required"/>
                </Property>
                <Property
                    name='work_description'
                    label={getLangText('Work description')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('Enter the description for your work')}
                        required="required"/>
                </Property>
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox/>
                </Property>
            </RegisterPiece>
        );
    }
});

export default PrizeRegisterPiece;
