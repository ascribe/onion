'use strict';

import React from 'react';
import RegisterPiece from '../../../register_piece';
import Property from '../../../ascribe_forms/property';
import InputTextAreaToggable from '../../../ascribe_forms/input_textarea_toggable';
import InputCheckbox from '../../../ascribe_forms/input_checkbox';

import { getLangText } from '../../../../utils/lang_utils';


let WalletRegisterPiece = React.createClass({
    render() {
        return (
            <RegisterPiece
                enableLocalHashing={false}
                headerMessage={getLangText('Submit to Cyland')}
                submitMessage={getLangText('Submit')}>
                <Property
                    name='loan'
                    label={getLangText('Loan to')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('videoarchive@cyland.org')}
                        required="required"/>
                </Property>
                <Property
                    name='gallery'
                    label={getLangText('Gallery')}
                    editable={true}>
                    <InputTextAreaToggable
                        rows={1}
                        editable={true}
                        placeholder={getLangText('Cyland Archive')}
                        required="required"/>
                </Property>
                <Property
                    name="terms"
                    className="ascribe-settings-property-collapsible-toggle"
                    style={{paddingBottom: 0}}>
                    <InputCheckbox>
                        <span>
                            {' ' + getLangText('I agree to the Terms of Service the art price') + ' '}
                            (<a href="https://s3-us-west-2.amazonaws.com/ascribe0/whitelabel/sluice/terms.pdf" target="_blank" style={{fontSize: '0.9em', color: 'rgba(0,0,0,0.7)'}}>
                                {getLangText('read')}
                            </a>)
                        </span>
                    </InputCheckbox>
                </Property>
            </RegisterPiece>
        );
    }
});

export default WalletRegisterPiece;
