'use strict';

import React from 'react';

import { getLangText } from '../utils/lang_utils';
import { setDocumentTitle } from '../utils/dom_utils';


const EndOfLife = () =>{
    setDocumentTitle(getLangText('EOL Title'));

    return (
        <div className="ascribe-eol-wrapper">
            <h3>{getLangText('EOL Title')}</h3>
            <p>{getLangText('EOL Text')} <a href="https://www.ascribe.io">{getLangText('EOL Action')}</a></p>
        </div>
    );
};


export default EndOfLife;
